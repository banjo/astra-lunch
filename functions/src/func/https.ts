import * as functions from "firebase-functions";
import { weeklyFood } from "../models/WeeklyFood";
import { fetchKockOchRock, fetchSodexo, fetchTaste } from "../parser";
import { DatabaseService } from "../services/DatabaseService";
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
