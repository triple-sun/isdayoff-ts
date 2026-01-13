import { IsDayOff } from "./src/isdayoff";

export * from "./src/types";
export * from "./src/enum";

const isDayOff = new IsDayOff("https://isdayoff.ru");

export default isDayOff;
