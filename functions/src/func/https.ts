import { capitalize } from "@banjoanton/utils";
import * as functions from "firebase-functions";
import SlackNotify from "slack-notify";
import { Restaurant } from "../models/Restaurant";
import { weeklyFood } from "../models/WeeklyFood";
import { fetchKockOchRock, fetchSodexo, fetchTaste } from "../parser";
import { DatabaseService } from "../services/DatabaseService";
import { DateUtil } from "../utils/DateUtil";
import { PromiseUtil, Result } from "../utils/PromiseUtil";

const mapAndSave = async (result: Result): Promise<void> => {
    const mapped = result.success ? weeklyFood.from(result.value, result.name) : weeklyFood.fail(result.name);
    await DatabaseService.addWeeklyFoodToDatabase(mapped);
};

export const parseFood = functions
    .region("europe-west1")
    .https.onRequest(async (request: functions.Request, response: functions.Response) => {
        const promises = [fetchTaste(), fetchKockOchRock(), fetchSodexo()];
        const [taste, kockOchRock, sodexo] = await Promise.allSettled(promises);

        await mapAndSave(PromiseUtil.handleResult(taste, "taste"));
        await mapAndSave(PromiseUtil.handleResult(kockOchRock, "kockochrock"));
        await mapAndSave(PromiseUtil.handleResult(sodexo, "sodexo"));

        response.send({ sodexo, taste, kockOchRock });
    });

export const sendToSlack = functions
    .region("europe-west1")
    .https.onRequest(async (request: functions.Request, response: functions.Response) => {
        const webhookUrl = process.env.SLACK_WEBHOOK_URL;

        if (!webhookUrl) {
            throw new Error("No webhook url");
        }

        const currentWeekNumber = DateUtil.getWeekNumber(new Date());
        const weeklyFoods = await DatabaseService.getWeeklyDatesByWeekNumber(currentWeekNumber);

        const weekday = DateUtil.getWeekdaySwedish();

        const foodForToday = weeklyFoods.map(weekly => {
            const food: string[] | null = weekly.food[weekday];
            return {
                name: weekly.name,
                food,
            };
        });

        let text = `*Dagens lunch för ${capitalize(weekday)}*\n\n`;
        for (const dailyMenu of foodForToday) {
            text += `*${Restaurant.toString(dailyMenu.name)}*\n`;

            if (!dailyMenu.food) {
                text += "Stängt 😟\n\n";
                continue;
            }

            for (const dish of dailyMenu.food) {
                text += `- ${dish}\n`;
            }

            text += "\n\n";
        }

        const slack = SlackNotify(webhookUrl);

        await slack.send({
            channel: "#lunch",
            text,
        });

        response.send("ok");
    });
