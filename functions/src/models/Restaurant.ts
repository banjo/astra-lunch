import { includes } from "@banjoanton/utils";

export const RESTAURANTS = ["sodexo", "kockochrock", "taste"] as const;
export type Restaurant = (typeof RESTAURANTS)[number];

const mapper: Record<Restaurant, string> = {
    sodexo: "Sodexo",
    kockochrock: "Kock och Rock",
    taste: "Taste",
};

const from = (name: string): Restaurant => {
    if (!includes(RESTAURANTS, name)) {
        throw new Error(`Resturant does not exist: ${name}`);
    }

    return name;
};

const toString = (restaurant: Restaurant): string => {
    return mapper[restaurant];
};

export const Restaurant = {
    from,
    toString,
};
