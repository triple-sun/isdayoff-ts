# idayoff-ts

[![NPM Version](https://img.shields.io/npm/v/isdayoff-ts.svg?style=flat-square)](https://www.npmjs.com/package/isdayoff-ts)
[![NPM Downloads](https://img.shields.io/npm/dt/isdayoff-ts.svg?style=flat-square)](https://www.npmjs.com/package/isdayoff-ts)

isdayoff-ts is a TypeScript fork and improvement of [isdayoff](https://www.npmjs.com/package/isdayoff), an API wrapper for [isdayoff.ru](https://isdayoff.ru).

- zero dependencies
- gets day-off status for today, tomorrow or any day
- gets day-off status for any month, year or an arbitrary time period no longer than 366 days
- checks if any year is a leap year

## Requirements

Node.js v18 and higher

## Installation

```bash
npm install isdayoff-ts --save
```

## Usage

### Basic functions

IsDayOff api calls for dates return an instance of `IsDayOffValue`:

`IsDayOffValue.bool()` returns:

- `true` for non-business days and holidays
- `false` for other values

`IsDayOffValue.value()` returns:

- 0 for business days
- 1 for non-business days
- 2 for short days when using `{ pre: true }`
- 4 for covid-era business days with `{ covid: true }`
- 8 for holidays when using `{ holidays: true }`

#### Custom api provider

Your custom api shoud have following endpoints:

- `/today` - no params
- `/tomorrow` - no params
- `/api/getdata`
- - `year` YYYY or YY
- - `month` MM
- - `day` DD
- - `date1` & `date2` YYYYMMDD
- - other api options (see ApiOptions type)
- - boolean options should be numeric
- `/api/isleap`
- - `year` YYYY or YY

```ts
import isDayOff from "isdayoff-ts";

await isDayOff
  .setUrl("https://your.api.url") 
  .today() // ..etc
```

#### Today

```ts
import isDayOff from "isdayoff-ts";

/** returns value for today */
isDayOff
  .today()
  .then((
    res // IsDayOffDay object
    ) => {
    const bool = res.bool(); // gets IsDayOffValue as boolean: true for days off and holidays, otherwise false;
    const val = res.value(); // gets IsDayOffValue from IsDayOffDay object;

    console.log(`${date} is a ${bool ? "non-" : ""}working day.`);

  })
  .catch((err) => console.log(err.message));
```

#### Tomorrow

```ts
import isDayOff from "isdayoff-ts";

/** returns value for tomorrow */
isDayOff
  .tomorrow()
  .then((res) =>
    console.log(`${date} is a ${res.bool() ? "non-" : ""}working day.`)
  )
  .catch((err) => console.log(err.message));
```

#### Any date

```ts
import isDayOff from "isdayoff-ts";

/** returns false if September 10 is a business day or true if it's not */
const date = new Date("2020-09-10");
isDayOff
  .day(date)
  .then((res) =>
    console.log(`${date} is a ${res.bool() ? "non-" : ""}working day.`)
  )
  .catch((err) => console.log(err.message));
```

#### Month

```ts
import isDayOff from "isdayoff-ts";

/** returns an array of IsDayOffDay objects for September 2020 */
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
```

#### Year

```ts
import isDayOff from "isdayoff-ts";

// returns an array of IsDayOffDay objects for 2021 year
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
```

#### Interval

```ts
import isDayOff from "isdayoff-ts";

// returns an array of IsDayOffDay objects for an interval
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
```

#### Is Leap Year

```ts
import isDayOff from "isdayoff-ts";

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
