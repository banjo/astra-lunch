import * as functions from "firebase-functions";
import { fetchLunch, sendToSlack } from "../controller";

export const parseFood = functions
    .region("europe-west1")
    .https.onRequest(async (request: functions.Request, response: functions.Response) => {
        await fetchLunch();
        response.send("ok");
    });

export const slack = functions
    .region("europe-west1")
    .https.onRequest(async (request: functions.Request, response: functions.Response) => {
        await sendToSlack();
        response.send("ok");
    });
