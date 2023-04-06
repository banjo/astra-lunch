import { JSDOM } from "jsdom";
import { parser } from "./parser.js";

const url = "https://www.santamariaworld.com/se/om-santa-maria/tastebysantamaria/";

export const fetchTaste = async () => {
    // const t = await fs.readFile("taste", "utf8");
    // return parser(t);

    const response = await fetch(url, {
        method: "GET",
    });

    if (response.status !== 200) {
        throw new Error("Failed to fetch taste");
    }

    const html = await response.text();

    const dom = new JSDOM(html);

    const article = dom.window.document.querySelector(".sm-article-page__content");

    const text = article?.textContent;

    if (!text) {
        throw new Error("No text found for Taste");
    }

    return parser(text);
};
