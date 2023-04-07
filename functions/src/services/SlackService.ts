import { capitalize } from "@banjoanton/utils";
import SlackNotify from "slack-notify";
import { Restaurant } from "../models/Restaurant";
import { DateUtil } from "../utils/DateUtil";
import { DatabaseService } from "./DatabaseService";

type DailyFood = {
    name: Restaurant;
    food: string[] | null;
}[];

const formatForSlack = (foodForToday: DailyFood): string => {
    const weekdaySwedish = DateUtil.getWeekdaySwedish();
    let text = `*Dagens lunch för ${capitalize(weekdaySwedish)}*\n\n`;
    for (const dailyMenu of foodForToday) {
        text += `*${Restaurant.toString(dailyMenu.name)}*\n`;

        if (!dailyMenu.food) {
            text += "_Stängt_ 😟\n\n";
            continue;
        }

        for (const dish of dailyMenu.food) {
            text += `- ${dish}\n`;
        }

        text += "\n";
    }

    return text;
};

const sendToSlack = async (text: string) => {
    const webhookUrl = process.env.SLACK_WEBHOOK_URL;

    if (!webhookUrl) {
        throw new Error("No webhook url");
    }

    const slack = SlackNotify(webhookUrl);

    await slack.send({
        channel: "#lunch",
        text,
    });
};

const sendDailyLunch = async () => {
    const currentWeekNumber = DateUtil.getWeekNumber(new Date());
    const weeklyFoods = await DatabaseService.getWeeklyDatesByWeekNumber(currentWeekNumber);

    // const weekdayEnglish = DateUtil.getWeekdayEnglish();
    const weekdayEnglish = "thursday";

    const foodForToday: DailyFood = weeklyFoods.map(weekly => {
        const food: string[] | null = weekly.food[weekdayEnglish];
        return {
            name: weekly.name,
            food,
        };
    });

    const text = formatForSlack(foodForToday);
    await sendToSlack(text);
};

export const SlackService = {
    sendDailyLunch,
};
