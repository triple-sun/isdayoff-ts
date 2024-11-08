# IsDayOff-TS

IsDayOff-TS is a TypeScript fork of [isdayoff](https://www.npmjs.com/package/isdayoff), an API wrapper for [isdayoff.ru](https://isdayoff.ru) that calculates business day status for any day, month or year, or for an arbitrary time period no longer than 366 days.

## Installation

```bash
npm install isdayoff-ts --save
```

## Usage

```ts
import IsDayOff from 'isdayoff-ts';
/** returns 0 if today is not a business day or 1 if it is */
IsDayOff
  .today()
  .then((res) => console.log(`Today is ${res ? 'non-' : ''}working day.`))
  .catch((err) => console.log(err.message));

/** returns 0 if September 10 is a business day or 1 if it's not */
IsDayOff
  .day({ month: 9, day: 10 })
  .then((res) => console.log(`10.09 is ${res ? 'non-' : ''}working day.`))
  .catch((err) => console.log(err.message));

/** returns an array of business/non-business days for September @example [0,1,1,0] */
IsDayOff
  .month({ month: 9 })
  .then((res) => console.log(JSON.stringify(res)))
  .catch((err) => console.log(err.message));

// returns an array of business/non-business days for 2021 year
IsDayOff
  .year({ year: 2021 })
  .then((res) => console.log(JSON.stringify(res)))
  .catch((err) => console.log(err.message));

// returns an array of business/non-business days for period
IsDayOff
  .period({
    start: new Date('2020-09-10'),
    end: new Date('2020-09-15'),
  })
  .then((res) => console.log(JSON.stringify(res)))
  .catch((err) => console.log(err.message));
```

## License

MIT
