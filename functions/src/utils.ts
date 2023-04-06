import * as crypto from "node:crypto";

export const isLocalDevelopment = () => {
    return process.env.IS_LOCAL_DEVELOPMENT === "true";
};

export const generateId = (): string => {
    return crypto.randomUUID();
};
