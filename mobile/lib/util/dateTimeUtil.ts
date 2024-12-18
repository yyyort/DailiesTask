export const dateToday = new Date().toISOString().split("T")[0];
export const timeNow = new Date()
    .toLocaleTimeString(navigator.language, {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
    })
    .split(" ")[0]; //hh:mm format
