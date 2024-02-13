import { escapeHtml } from "@banjoanton/utils";
import vision from "@google-cloud/vision";
import fetchCookie from "fetch-cookie";
import { JSDOM } from "jsdom";
import { Logger } from "../../logger.js";
import { parser } from "./parser.js";
import { Parsed } from "../../models/Parsed.js";

const fetchWithCookies = fetchCookie(fetch);

const URL = "https://workz.sodexo.se/info/restaurang-goteborg/";
const KEY_FILE = "key.json";

export const fetchSodexo = async (): Promise<Parsed> => {
    const email = process.env.SODEXO_EMAIL ?? null;
    const password = process.env.SODEXO_PASSWORD ?? null;
    const homeSite = 15;

    if (!email || !password) {
        throw new Error("Missing email or password");
    }

    const body = `epost=${escapeHtml(email)}&losen=${escapeHtml(password)}&homeSite=${homeSite}`;

    const login = await fetchWithCookies("https://workz.sodexo.se/?login=1", {
        headers: {
            "content-type": "application/x-www-form-urlencoded",
        },
        body,
        method: "POST",
    });

    const loginText = await login.text();

    if (
        login.status !== 200 ||
        loginText.includes("Du angav ett felaktigt användarnamn eller lösenord.")
    ) {
        throw new Error("Failed to login");
    }

    Logger.log(`Login status: ${login.status}`);

    const lunchResponse = await fetchWithCookies(URL, {
        method: "GET",
    });

    if (lunchResponse.status !== 200) {
        throw new Error("Failed to fetch lunch");
    }

    Logger.log(`Lunch status: ${lunchResponse.status}`);

    const html = await lunchResponse.text();
    const dom = new JSDOM(html);

    const images = dom.window.document.querySelectorAll("img");
    const userImages = [...images].filter(
        image => image.src.includes("userfile") && !image.src.includes("mat")
    );

    if (userImages.length === 0) {
        throw new Error("No images found");
    }

    const image = userImages[0];
    const fullUrl = `https://workz.sodexo.se${image.src}`;

    Logger.log(`Downloading image: ${fullUrl}`);

    const downloadResponse = await fetchWithCookies(fullUrl, {
        method: "GET",
    });

    if (downloadResponse.status !== 200) {
        throw new Error("Failed to download image");
    }

    Logger.log(`Download status: ${downloadResponse.status}`);

    const buffer = Buffer.from(await downloadResponse.arrayBuffer());

    Logger.log("Using Google Vision API");

    const client = new vision.ImageAnnotatorClient({
        keyFile: KEY_FILE,
    });

    const [result] = await client.textDetection(buffer);

    const text = result.textAnnotations?.[0].description;

    if (!text) {
        throw new Error("No text found in sodexo image");
    }

    Logger.log("Parsing text");
    return Parsed.from(parser(text), fullUrl);
};
