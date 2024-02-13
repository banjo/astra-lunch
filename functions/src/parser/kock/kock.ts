import { isDefined } from "@banjoanton/utils";
import { JSDOM } from "jsdom";
import { Month } from "../../models/Month";
import { DateUtil } from "../../utils/DateUtil";
import { Parsed } from "../../models/Parsed";

const url = "https://kockochrock.se/veckans-lunch"; // todo: remove 1

export const fetchKockOchRock = async () => {
    const response = await fetch(url, {
        method: "GET",
    });

    if (response.status !== 200) {
        throw new Error("Failed to fetch Kock och Rock");
    }

    const html = await response.text();
    const dom = new JSDOM(html);
    const menu = dom.window.document.querySelector(".lunch_menu");

    const mosluckan = getMosluckanMenu(menu);

    if (!menu) {
        throw new Error("No menu found");
    }

    const children = [...menu.children];
    const allFood: Record<string, string[] | null> = {};

    for (const child of children) {
        if (
            !child.className.includes("header") ||
            child.textContent?.trim().toLowerCase() === "vardagsmeny" ||
            child.textContent?.trim().toLowerCase() === "serveras hela veckan"
        ) {
            continue;
        }

        const header = child.querySelector("h3")?.textContent?.trim();

        if (!header || !isValidDate(header)) {
            continue;
        }

        if (!child.nextElementSibling) {
            continue;
        }

        const foodElements = [...child.nextElementSibling.querySelectorAll(".td_title")];
        const foodNames = foodElements
            .map(f => f?.textContent?.trim())
            .filter(v => isDefined(v)) as string[];

        const [_, day, month] = header.replace("  ", " ").split(" ");
        const englishMonth = Month.swedishToEnglish(month);

        const today = `${day} ${englishMonth}, ${new Date().getFullYear()}`;

        const todayEnglish = DateUtil.getWeekdayEnglish(new Date(today));

        const hasClosedText = foodNames.some(food => food.toLowerCase().includes("stängt"));
        const tooFewEntries = foodNames.length <= 1;

        if (hasClosedText || tooFewEntries) {
            allFood[todayEnglish] = null;
            continue;
        }

        allFood[todayEnglish] = [...foodNames, ...mosluckan];
    }

    return Parsed.from(allFood, url);
};

function isValidDate(string_) {
    const d = new Date(string_);
    const isDate = !Number.isNaN(d.getTime());

    if (isDate) return true;

    const [_, day, month] = string_.split(" ");
    const englishMonth = Month.swedishToEnglish(month);

    const date = new Date(`${englishMonth} ${day}, ${new Date().getFullYear()}`);

    return !Number.isNaN(date.getTime());
}

function getMosluckanMenu(menu) {
    const children = [...menu.children];

    const vardagsmeny = children.find(c => {
        const h3 = c.querySelector("h3");
        return h3 && h3.textContent.trim() === "Vardagsmeny";
    });

    if (!vardagsmeny) {
        return [];
    }

    const sibling = vardagsmeny.nextElementSibling;
    const content: string = sibling.querySelector(".td_title").textContent.trim();

    const food: string[] = [];
    let doParse = false;

    for (const line of content.split("\n")) {
        if (line.toLowerCase().includes("mosluckan:")) {
            doParse = true;
            continue;
        }

        if (!doParse) {
            continue;
        }

        food.push(line);
    }

    return food;
}
