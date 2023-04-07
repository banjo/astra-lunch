import * as functions from "firebase-functions";
import { type Restaurant } from "../models/Restaurant";

export type Result = {
    name: Restaurant;
    value: any;
    success: boolean;
};

const handleResult = (result: PromiseSettledResult<any>, name: Restaurant): Result => {
    if (result.status === "fulfilled") {
        functions.logger.info("Result", result.value);
        return { name, value: result.value, success: true };
    }

    functions.logger.error("Error", result.reason);
    return { name, value: result.reason, success: false };
};

export const PromiseUtil = {
    handleResult,
};
