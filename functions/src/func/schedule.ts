import * as functions from "firebase-functions";
import { fetchLunch, sendToSlack } from "../controller";

export const fetchWorker = functions
    .region("europe-west1")
    .pubsub.schedule("0 8-12 * * 1") // 8-12 every monday, once per hour
    .timeZone("Europe/Stockholm")
    .onRun(async () => {
        await fetchLunch();
    });

export const slackWorker = functions
    .region("europe-west1")
    .pubsub.schedule("every weekday 10:00")
    .timeZone("Europe/Stockholm")
    .onRun(async () => {
        await sendToSlack();
    });
