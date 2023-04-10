import * as functions from "firebase-functions";

const log = (message: string): void => {
    functions.logger.log(message);
};

export const Logger = {
    log,
};
