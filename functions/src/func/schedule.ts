import * as functions from "firebase-functions";

export const helloWorldWorker = functions
    .region("europe-west1")
    .pubsub.schedule("every day 00:00")
    .onRun(() => {
        functions.logger.info("Hello logs!", { structuredData: true });
        return null;
    });
