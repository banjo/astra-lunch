import { RawParsingData } from "./RawParsingData";

export type Parsed = {
    value: RawParsingData;
    url: string;
};

const from = (value: RawParsingData, url: string): Parsed => {
    return {
        value,
        url,
    };
};

export const Parsed = {
    from,
};
