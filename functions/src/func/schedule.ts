import * as functions from "firebase-functions";
import { fetchLunch, sendToSlack } from "../controller";

export const fetchWorker = functions
    .region("europe-west1")
    .pubsub.schedule("0 9-12 * * 1") // 9-12 every monday, once per hour
    .timeZone("Europe/Stockholm")
    .onRun(async () => {
        await fetchLunch();
    });

export const slackWorker = functions
    .region("europe-west1")
    .pubsub.schedule("0 9 * * 2-5") // 9 every tuesday-friday
    .timeZone("Europe/Stockholm")
    .onRun(async () => {
        await sendToSlack();
    });
