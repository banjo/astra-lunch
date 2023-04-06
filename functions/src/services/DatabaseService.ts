import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import * as functions from "firebase-functions";
import { WeeklyFood } from "../models/WeeklyFood";

initializeApp();

const database = getFirestore();

const addWeeklyFoodToDatabase = async (weeklyFood: WeeklyFood): Promise<void> => {
    const query = await database
        .collection("food")
        .where("weekNumber", "==", weeklyFood.weekNumber)
        .where("name", "==", weeklyFood.name)
        .get();

    const data = query.docs.map<WeeklyFood>(document_ => document_.data() as WeeklyFood);

    if (data.length === 1) {
        functions.logger.debug(`Already fetched ${weeklyFood.name} for week ${weeklyFood.weekNumber}`);
        const object = data[0];
        if (object.successfullyFetched) {
            functions.logger.debug(`Not updating ${weeklyFood.name} for week ${weeklyFood.weekNumber}`);
            return;
        }

        functions.logger.debug(`Updating ${weeklyFood.name} for week ${weeklyFood.weekNumber}`);
        await database.collection("food").doc(object.id).delete();
        return;
    }

    await database.collection("food").add(weeklyFood);
};

export const DatabaseService = {
    addWeeklyFoodToDatabase,
};
