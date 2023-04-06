const format = (date: Date): string => {
    // I want date in this format: 2020-01-01
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    return `${year}-${month}-${day}`;
};

export const DateUtil = { format };
