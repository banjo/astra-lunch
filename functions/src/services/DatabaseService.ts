import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { Logger } from "../logger";
import { WeeklyFood } from "../models/WeeklyFood";

initializeApp();

const database = getFirestore();

const isSame = (first: WeeklyFood, second: WeeklyFood) => {
    return first.food.monday?.[0] === second.food.monday?.[0];
};

const addWeeklyFoodToDatabase = async (weeklyFood: WeeklyFood): Promise<boolean> => {
    let weekPreviousFetch;
    let yearPreviousFetch;
    if (weeklyFood.weekNumber === 1) {
        Logger.log(`Week is 1, fetching last week of previous year for ${weeklyFood.name}`);
        weekPreviousFetch = 52;
        yearPreviousFetch = weeklyFood.year - 1;
    } else {
        Logger.log(`Fetching previous week for ${weeklyFood.name}`);
        weekPreviousFetch = weeklyFood.weekNumber - 1;
        yearPreviousFetch = weeklyFood.year;
    }

    const queryPreviousFetch = await database
        .collection("food")
        .where("weekNumber", "==", weekPreviousFetch)
        .where("name", "==", weeklyFood.name)
        .where("year", "==", yearPreviousFetch)
        .get();

    const dataPreviousFetch = queryPreviousFetch.docs.map<WeeklyFood>(
        document_ => document_.data() as WeeklyFood
    );

    if (dataPreviousFetch.length === 1) {
        Logger.log(`Found previous fetch for ${weeklyFood.name}`);
        const previousData = dataPreviousFetch[0];
        if (isSame(weeklyFood, previousData)) {
            Logger.log(
                `Food is same as last week for ${weeklyFood.name}, has not been updated yet.`
            );
            return false;
        }

        Logger.log("Food is different from last week, updating");
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
        Logger.log(`Already fetched ${weeklyFood.name} for week ${weeklyFood.weekNumber}`);
        const object = data[0];
        if (object.successfullyFetched) {
            Logger.log(`Not updating ${weeklyFood.name} for week ${weeklyFood.weekNumber}`);
            return true;
        }

        Logger.log(`Updating ${weeklyFood.name} for week ${weeklyFood.weekNumber}`);
        await database.collection("food").doc(object.id).delete();
        return true;
    }

    Logger.log(`Adding ${weeklyFood.name} for week ${weeklyFood.weekNumber} to database`);
    await database.collection("food").add(weeklyFood);
    return true;
};

const getWeeklyFoodByWeekNumber = async (weekNumber: number): Promise<WeeklyFood[]> => {
    const query = await database.collection("food").where("weekNumber", "==", weekNumber).get();
    return query.docs.map<WeeklyFood>(document_ => document_.data() as WeeklyFood);
};

const hasSentLunchForWeek = async (weekNumber: number): Promise<boolean> => {
    const query = await database.collection("sent").where("weekNumber", "==", weekNumber).get();

    const data = query.docs.map(document_ => document_.data());

    Logger.log(`Has sent lunch for week data: ${data}`);

    return data.length > 0;
};

const setSentLunchForWeek = async (weekNumber: number): Promise<void> => {
    await database.collection("sent").add({ weekNumber });
};

export const DatabaseService = {
    addWeeklyFoodToDatabase,
    getWeeklyFoodByWeekNumber,
    hasSentLunchForWeek,
    setSentLunchForWeek,
};
