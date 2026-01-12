export enum IsDayOffValue {
    BusinessDay = 0,
    DayOff = 1,
    ShortDay = 2,
    CovidBusinessDay = 4,
    Holiday = 8
}

export enum IsDayOffCallType {
  Today = "today",
  Tomorrow = "tomorrow",
  Interval = "interval",
  Day = "day",
  Month = "month",
  Year = "year",
  LeapYear = "leap",
}