const soupOfTheWeekText = "Veckans soppa";
const days = ["Måndag", "Tisdag", "Onsdag", "Torsdag", "Fredag"];
const mainPrefixes = ["Santa Maria:", "Husman:", "Santa maria:", "husman:"];
const vegPrefix = "Veg:";
const closed = ["Stängt"];

export const parser = (text: string) => {
    const lines = text.split("\n");

    let soupOfTheWeek = "";
    let allFood = {};
    let index = -1;
    for (const line of lines) {
        index++;

        if (line.includes(soupOfTheWeekText)) {
            const soup = lines[index + 1];
            soupOfTheWeek = soup;
            continue;
        }

        const day = days.find(d => line.includes(d));
        if (!day) continue;

        const followingLines = [lines[index + 1], lines[index + 2], lines[index + 3]];

        let main = "";
        let veg = "";

        if (followingLines.some(l => closed.some(c => l.includes(c)))) {
            allFood = {
                ...allFood,
                [day.toLowerCase()]: null,
            };
            continue;
        }

        for (const followingLine of followingLines) {
            const mainPrefix = mainPrefixes.find(prefix => followingLine.includes(prefix));

            if (mainPrefix) {
                main = followingLine.replace(mainPrefix, "");
            } else if (followingLine.includes(vegPrefix)) {
                veg = followingLine.replace(vegPrefix, "");
            }
        }

        const dailyFood = [main.trim(), veg.trim()];

        if (soupOfTheWeek) {
            dailyFood.push(soupOfTheWeek.trim());
        }

        allFood = {
            ...allFood,
            [day.toLowerCase()]: dailyFood,
        };
    }

    return allFood;
};
