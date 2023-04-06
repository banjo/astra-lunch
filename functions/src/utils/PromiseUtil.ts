import * as functions from "firebase-functions";

export type Result = {
    name: string;
    value: any;
    success: boolean;
};

const handleResult = (result: PromiseSettledResult<any>, name: string): Result => {
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
