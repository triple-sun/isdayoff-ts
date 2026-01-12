# IsDayOff-TS

IsDayOff-TS is a TypeScript fork and improvement of [isdayoff](https://www.npmjs.com/package/isdayoff), an API wrapper for [isdayoff.ru](https://isdayoff.ru).

- zero dependencies
- gets day-off status for today, tomorrow or any day
- gets day-off status for any month, year or an arbitrary time period no longer than 366 days
- checks if any year is a leap year

## Installation

```bash
npm install isdayoff-ts --save
```

## Usage

```ts
import isDayOff from "isdayoff-ts";

/** returns false if today is a business day or true if it's not */
isDayOff
  .today()
  .then((res) => {
    console.log(`${date} is a ${res.bool() ? "non-" : ""}working day.`);

    res.value() /** @see IsDayOffValue */
  })
  .catch((err) => console.log(err.message));

/** returns false if tomorrow is a business day or true if it's not */
isDayOff
  .tomorrow()
  .then((res) =>
    console.log(`${date} is a ${res.bool() ? "non-" : ""}working day.`)
  )
  .catch((err) => console.log(err.message));

/** returns false if September 10 is a business day or true if it's not */
const date = new Date("2020-09-10");
isDayOff
  .day(date)
  .then((res) =>
    console.log(`${date} is a ${res.bool() ? "non-" : ""}working day.`)
  )
  .catch((err) => console.log(err.message));

/** returns an array of business/non-business days for September 2020 @example [0,1,1,0] */
isDayOff
  .month(new Date("2020-09-01"))
  .then((res) => {
    res.forEach((v, i) => {
      console.log(
        `${i + 1}.${date.getMonth() + 1}.${date.getFullYear()} is a ${v.bool() ? "non-" : ""}working day.`
      );
    });
  })
  .catch((err) => console.log(err.message));

// returns an array of business/non-business days for 2021 year
isDayOff
  .year(new Date(2021))
  .then((res) => {
    res.forEach((v, i) => {
      console.log(
        `Day ${i + 1} in year ${date.getFullYear()} is a ${v.bool() ? "non-" : ""}working day.`
      );
    });
  })
  .catch((err) => console.log(err.message));

// returns an array of business/non-business days for an interval
isDayOff
  .interval(new Date("2020-09-10"), new Date("2020-09-15"))
  .then((res) =>
    res.forEach((v, i) => {
      console.log(
        `Day ${i + 1} in month ${date.getMonth() + 1} of year ${date.getFullYear()} is a ${v.bool() ? "non-" : ""}working day.`
      );
    })
  )
  .catch((err) => console.log(err.message));

// returns is year a leap year or not
const leapDate = new Date("2020-09-10");
isDayOff
  .isLeapYear(leapDate)
  .then((res) =>
    console.log(
      `${leapDate.getFullYear()} is ${res ? "not " : ""}a leap year")`
    )
  )
  .catch((err) => console.log(err.message));

```

## License

MIT
