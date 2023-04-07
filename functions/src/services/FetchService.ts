import { WeeklyFood } from "../models/WeeklyFood";
import { fetchKockOchRock, fetchSodexo, fetchTaste } from "../parser";
import { PromiseUtil, Result } from "../utils/PromiseUtil";
import { DatabaseService } from "./DatabaseService";

const mapAndSave = async (result: Result): Promise<void> => {
    const mapped = result.success ? WeeklyFood.from(result.value, result.name) : WeeklyFood.fail(result.name);
    await DatabaseService.addWeeklyFoodToDatabase(mapped);
};

const fetchLunches = async () => {
    const promises = [fetchTaste(), fetchKockOchRock(), fetchSodexo()];
    const [taste, kockOchRock, sodexo] = await Promise.allSettled(promises);

    await mapAndSave(PromiseUtil.handleResult(taste, "taste"));
    await mapAndSave(PromiseUtil.handleResult(kockOchRock, "kockochrock"));
    await mapAndSave(PromiseUtil.handleResult(sodexo, "sodexo"));
};

export const FetchService = { fetchLunches };
