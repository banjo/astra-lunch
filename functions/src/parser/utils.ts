export const weekdays = ["måndag", "tisdag", "onsdag", "torsdag", "fredag"];

export const isLocalDevelopment = () => {
    return process.env.IS_LOCAL_DEVELOPMENT === "true";
};
