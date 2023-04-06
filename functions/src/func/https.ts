import * as functions from "firebase-functions";
import { fetchKockOchRock, fetchSodexo, fetchTaste } from "../parser";

export const parseFood = functions
    .region("europe-west1")
    .https.onRequest(async (request: functions.Request, response: functions.Response) => {
        functions.logger.info("Hello logs!", { structuredData: true });

        const taste = await fetchTaste();
        const kock = await fetchKockOchRock();
        const sodexo = await fetchSodexo();

        response.send({ sodexo, taste, kock });
    });
