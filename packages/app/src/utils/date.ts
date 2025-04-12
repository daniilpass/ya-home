export const getStartOfTheDay = () => {
    const today = new Date();
    today.setHours(0, 0, 0);
    return today;
};

export const getDateString = (date: Date) => {
    const dd = date.getDate().toString().padStart(2, '0');
    const MM = date.getMonth().toString().padStart(2, '0');
    return `${dd}.${MM}`;
};

export const getTimeString = (date: Date) => {
    const hh = date.getHours().toString().padStart(2, '0');
    const mm = date.getMinutes().toString().padStart(2, '0');
    return `${hh}:${mm}`;
};