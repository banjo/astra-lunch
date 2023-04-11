import * as crypto from "node:crypto";

export const generateId = (): string => {
    return crypto.randomUUID();
};
