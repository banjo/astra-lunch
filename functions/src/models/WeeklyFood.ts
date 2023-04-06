import currentWeekNumber from "current-week-number";
import { generateId } from "../utils";
import { DateUtil } from "../utils/DateUtil";

type Food = {
    monday: string[] | null;
    tuesday: string[] | null;
    wednesday: string[] | null;
    thursday: string[] | null;
    friday: string[] | null;
};

export type PartialFood = Partial<Food>;

export type WeeklyFood = {
    food: Food;
    dateMonday: string;
    weekNumber: number;
    name: string;
    successfullyFetched: boolean;
    id: string;
};

const getMondayDate = () => {
    const dateMonday = new Date();
    const day = dateMonday.getDay();
    const diff = dateMonday.getDate() - day + (day === 0 ? -6 : 1);
    dateMonday.setDate(diff);

    return dateMonday;
};

const from = (fetched: PartialFood, name: string): WeeklyFood => {
    const food: Food = {
        monday: fetched.monday ?? null,
        tuesday: fetched.tuesday ?? null,
        wednesday: fetched.wednesday ?? null,
        thursday: fetched.thursday ?? null,
        friday: fetched.friday ?? null,
    };

    const dateMonday = getMondayDate();
    const weekNumber = currentWeekNumber(dateMonday);
    const haveFailed = Object.values(food).every(v => v === null);

    return {
        food,
        dateMonday: DateUtil.format(dateMonday),
        weekNumber,
        name,
        successfullyFetched: !haveFailed,
        id: generateId(),
    };
};

const fail = (name: string): WeeklyFood => {
    const dateMonday = getMondayDate();

    const weekNumber = currentWeekNumber(dateMonday);

    return {
        food: {
            monday: null,
            tuesday: null,
            wednesday: null,
            thursday: null,
            friday: null,
        },
        dateMonday: DateUtil.format(dateMonday),
        weekNumber,
        name,
        successfullyFetched: false,
        id: generateId(),
    };
};

export const weeklyFood = {
    from,
    fail,
};
