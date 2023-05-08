import { capitalize } from "@banjoanton/utils";
import SlackNotify from "slack-notify";
import { Logger } from "../logger";
import { Restaurant, RESTAURANTS } from "../models/Restaurant";
import { DateUtil } from "../utils/DateUtil";
import { DatabaseService } from "./DatabaseService";
import { EmojiService } from "./EmojiService";

type DailyFood = {
    name: Restaurant;
    food: string[] | null;
}[];

const formatForSlack = (foodForToday: DailyFood): string => {
    const weekdaySwedish = DateUtil.getWeekdaySwedish();
    let text = `--- *Dagens lunch ${capitalize(weekdaySwedish)}* ---\n\n`;
    for (const restaurant of RESTAURANTS) {
        const dailyMenu = foodForToday.find(daily => daily.name === restaurant);
        text += `*${Restaurant.toString(restaurant)}*\n`;

        if (!dailyMenu?.food) {
            text += "😟\t_Stängt (eller problem...)_\n\n";
            continue;
        }

        for (const dish of dailyMenu.food) {
            const emojis = EmojiService.getLunchEmojis(dish, 1);
            text += `${emojis}\t${dish}\n`;
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
    const weeklyFood = await DatabaseService.getWeeklyFoodByWeekNumber(currentWeekNumber);

    const weekdayEnglish = DateUtil.getWeekdayEnglish();
    Logger.log(`Sending daily lunch for ${weekdayEnglish} (${currentWeekNumber})`);

    const foodForToday: DailyFood = weeklyFood.map(weekly => {
        const food: string[] | null = weekly.food[weekdayEnglish];
        return {
            name: weekly.name,
            food,
        };
    });

    if (foodForToday.every(daily => !daily.food)) {
        Logger.log(`No food found for ${weekdayEnglish} (${currentWeekNumber})`);
    }

    Logger.log("Sending to slack");

    const text = formatForSlack(foodForToday);
    await sendToSlack(text);

    Logger.log("Sent to slack");
};

export const SlackService = {
    sendDailyLunch,
};
