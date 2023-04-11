import { Logger } from "../logger";
import { WeeklyFood } from "../models/WeeklyFood";
import { fetchKockOchRock, fetchSodexo, fetchTaste } from "../parser/index";
import { PromiseUtil, Result } from "../utils/PromiseUtil";
import { DatabaseService } from "./DatabaseService";

const mapAndSave = async (result: Result): Promise<boolean> => {
    let success = true;
    let mapped;
    if (result.success) {
        Logger.log(`Success with promise for ${result.name}`);
        mapped = WeeklyFood.from(result.value, result.name);
    } else {
        Logger.log(`Failed to fetch ${result.name}`);
        mapped = WeeklyFood.fail(result.name);
        success = false;
    }

    const databaseResult = await DatabaseService.addWeeklyFoodToDatabase(mapped);

    if (!databaseResult || !success) {
        Logger.log(`Something went wrong with ${result.name}`);
        return false;
    }

    Logger.log(`Successfully fetched ${result.name}`);
    return true;
};

const fetchLunches = async () => {
    Logger.log("Fetching lunches");

    try {
        const promises = [fetchTaste(), fetchKockOchRock(), fetchSodexo()];
        const [taste, kockOchRock, sodexo] = await Promise.allSettled(promises);

        const tasteResult = await mapAndSave(PromiseUtil.handleResult(taste, "taste"));
        const kockResult = await mapAndSave(PromiseUtil.handleResult(kockOchRock, "kockochrock"));
        const sodexoResult = await mapAndSave(PromiseUtil.handleResult(sodexo, "sodexo"));

        return tasteResult && kockResult && sodexoResult;
    } catch (error) {
        Logger.log(error);
        return false;
    }
};

export const FetchService = { fetchLunches };
