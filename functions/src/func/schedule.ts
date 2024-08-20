import * as functions from "firebase-functions";
import { cleanAndFetch, fetchLunch, sendToSlack, trySendToSlack } from "../controller";

export const fetchWorker = functions
    .region("europe-west1")
    .pubsub.schedule("0 9-11 * * 1") // 9-11 every monday, once per hour
    .timeZone("Europe/Stockholm")
    .onRun(async () => {
        await fetchLunch();
    });

export const sendToSlackMondayWorker = functions
    .region("europe-west1")
    .pubsub.schedule("5 11 * * 1") // 11:05 every monday
    .timeZone("Europe/Stockholm")
    .onRun(async () => {
        await trySendToSlack();
    });

export const cleanAndFetchWorker = functions
    .region("europe-west1")
    .pubsub.schedule("0 8 * * 2") // 8 every tuesday
    .timeZone("Europe/Stockholm")
    .onRun(async () => {
        await cleanAndFetch();
    });

export const slackWorker = functions
    .region("europe-west1")
    .pubsub.schedule("0 9 * * 2-5") // 9 every tuesday-friday
    .timeZone("Europe/Stockholm")
    .onRun(async () => {
        await sendToSlack();
    });
