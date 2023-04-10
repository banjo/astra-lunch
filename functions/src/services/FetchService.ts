import { Logger } from "../logger";
import { WeeklyFood } from "../models/WeeklyFood";
import { fetchKockOchRock, fetchSodexo, fetchTaste } from "../parser";
import { PromiseUtil, Result } from "../utils/PromiseUtil";
import { DatabaseService } from "./DatabaseService";

const mapAndSave = async (result: Result): Promise<void> => {
    let mapped;
    if (result.success) {
        Logger.log(`Success with promise for ${result.name}`);
        mapped = WeeklyFood.from(result.value, result.name);
    } else {
        Logger.log(`Failed to fetch ${result.name}`);
        mapped = WeeklyFood.fail(result.name);
    }

    await DatabaseService.addWeeklyFoodToDatabase(mapped);
};

const fetchLunches = async () => {
    Logger.log("Fetching lunches");
    const promises = [fetchTaste(), fetchKockOchRock(), fetchSodexo()];
    const [taste, kockOchRock, sodexo] = await Promise.allSettled(promises);

    await mapAndSave(PromiseUtil.handleResult(taste, "taste"));
    await mapAndSave(PromiseUtil.handleResult(kockOchRock, "kockochrock"));
    await mapAndSave(PromiseUtil.handleResult(sodexo, "sodexo"));
};

export const FetchService = { fetchLunches };
