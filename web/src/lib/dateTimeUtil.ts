export const convertDateTimeUTCtoLocal = (dateTime: string): string => {
    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    console.log(userTimeZone);

    const date = new Date(dateTime);
    const localTime = date.toLocaleTimeString("en-US", {
        timeZone: userTimeZone,
        hour12: true,
    });
    return localTime;

};