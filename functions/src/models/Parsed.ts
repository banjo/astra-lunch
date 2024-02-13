export type Parsed = {
    value: any;
    url: string;
};

const from = (value: any, url: string): Parsed => {
    return {
        value,
        url,
    };
};

export const Parsed = {
    from,
};
