import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import * as functions from "firebase-functions";
import { WeeklyFood } from "../models/WeeklyFood";

initializeApp();

const database = getFirestore();

const isSame = (first: WeeklyFood, second: WeeklyFood) => {
    return JSON.stringify(first) === JSON.stringify(second);
};

const addWeeklyFoodToDatabase = async (weeklyFood: WeeklyFood): Promise<boolean> => {
    let weekPreviousFetch;
    let yearPreviousFetch;
    if (weeklyFood.weekNumber === 1) {
        weekPreviousFetch = 52;
        yearPreviousFetch = weeklyFood.year - 1;
    } else {
        weekPreviousFetch = weeklyFood.weekNumber - 1;
        yearPreviousFetch = weeklyFood.year;
    }

    const queryPreviousFetch = await database
        .collection("food")
        .where("weekNumber", "==", weekPreviousFetch)
        .where("name", "==", weeklyFood.name)
        .where("year", "==", yearPreviousFetch)
        .get();

    const dataPreviousFetch = queryPreviousFetch.docs.map<WeeklyFood>(document_ => document_.data() as WeeklyFood);

    if (dataPreviousFetch.length === 1) {
        const previousData = dataPreviousFetch[0];
        if (isSame(weeklyFood, previousData)) {
            functions.logger.log("Food is same as last week, has not been updated yet.");
            return false;
        }
    }

    const currentYear = new Date().getFullYear();

    const query = await database
        .collection("food")
        .where("weekNumber", "==", weeklyFood.weekNumber)
        .where("name", "==", weeklyFood.name)
        .where("year", "==", currentYear)
        .get();

    const data = query.docs.map<WeeklyFood>(document_ => document_.data() as WeeklyFood);

    if (data.length === 1) {
        functions.logger.debug(`Already fetched ${weeklyFood.name} for week ${weeklyFood.weekNumber}`);
        const object = data[0];
        if (object.successfullyFetched) {
            functions.logger.debug(`Not updating ${weeklyFood.name} for week ${weeklyFood.weekNumber}`);
            return true;
        }

        functions.logger.debug(`Updating ${weeklyFood.name} for week ${weeklyFood.weekNumber}`);
        await database.collection("food").doc(object.id).delete();
        return true;
    }

    await database.collection("food").add(weeklyFood);
    return true;
};

const getWeeklyDatesByWeekNumber = async (weekNumber: number): Promise<WeeklyFood[]> => {
    const query = await database.collection("food").where("weekNumber", "==", weekNumber).get();
    return query.docs.map<WeeklyFood>(document_ => document_.data() as WeeklyFood);
};

export const DatabaseService = {
    addWeeklyFoodToDatabase,
    getWeeklyDatesByWeekNumber,
};
