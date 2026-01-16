import { IsDayOff } from "./isdayoff";

export * from "./enum";
export * from "./types";

const isDayOff = new IsDayOff("https://isdayoff.ru");

export default isDayOff;
