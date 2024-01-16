import { getWeekNumber } from "@banjoanton/utils";
import * as functions from "firebase-functions";
import { fetchLunch, sendToSlack } from "../controller";
import { DatabaseService } from "../services/DatabaseService";

export const parseFood = functions
    .region("europe-west1")
    .https.onRequest(async (request: functions.Request, response: functions.Response) => {
        await fetchLunch();
        response.send("ok");
    });

export const parseFoodWithoutSlack = functions
    .region("europe-west1")
    .https.onRequest(async (request: functions.Request, response: functions.Response) => {
        await fetchLunch(true);
        response.send("ok");
    });

export const slack = functions
    .region("europe-west1")
    .https.onRequest(async (request: functions.Request, response: functions.Response) => {
        await sendToSlack();
        response.send("ok");
    });

export const deleteWeek = functions
    .region("europe-west1")
    .https.onRequest(async (request: functions.Request, response: functions.Response) => {
        await DatabaseService.deleteWeeklyFoodByWeekNumber(getWeekNumber());
        response.send("ok");
    });
