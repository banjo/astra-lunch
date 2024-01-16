import { Logger } from "../logger";
import { type Restaurant } from "../models/Restaurant";

export type Result = {
    name: Restaurant;
    value: any;
    success: boolean;
};

const handleResult = (result: PromiseSettledResult<any>, name: Restaurant): Result => {
    if (result.status === "fulfilled") {
        Logger.log(`Success with promise for ${name}`);
        return { name, value: result.value, success: true };
    }

    Logger.log(`Error with promise for ${name}: ${result.reason}`);
    return { name, value: result.reason, success: false };
};

export const PromiseUtil = {
    handleResult,
};
