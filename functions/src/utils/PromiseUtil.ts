import { Logger } from "../logger";
import { Parsed } from "../models/Parsed";
import { type Restaurant } from "../models/Restaurant";

export type Result = {
    name: Restaurant;
    value: any;
    success: boolean;
    url: string;
};

const handleResult = (result: PromiseSettledResult<Parsed>, name: Restaurant): Result => {
    if (result.status === "fulfilled") {
        Logger.log(`Success with promise for ${name}`);
        return { name, value: result.value.value, success: true, url: result.value.url };
    }

    Logger.log(`Error with promise for ${name}: ${result.reason}`);
    return { name, value: result.reason, success: false, url: "" };
};

export const PromiseUtil = {
    handleResult,
};
