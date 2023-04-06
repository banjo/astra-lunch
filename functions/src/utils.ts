import * as functions from "firebase-functions";
import * as crypto from "node:crypto";

export type Result = {
    name: string;
    value: any;
    success: boolean;
};

export const handleResult = (result: PromiseSettledResult<any>, name: string): Result => {
    if (result.status === "fulfilled") {
        functions.logger.info("Result", result.value);
        return { name, value: result.value, success: true };
    }

    functions.logger.error("Error", result.reason);
    return { name, value: result.reason, success: false };
};

export const weekdays = ["måndag", "tisdag", "onsdag", "torsdag", "fredag"];

export const isLocalDevelopment = () => {
    return process.env.IS_LOCAL_DEVELOPMENT === "true";
};

export const generateId = (): string => {
    return crypto.randomUUID();
};
