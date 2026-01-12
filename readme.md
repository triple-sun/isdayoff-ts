# IsDayOff-TS

IsDayOff-TS is a TypeScript fork of [isdayoff](https://www.npmjs.com/package/isdayoff), an API wrapper for [isdayoff.ru](https://isdayoff.ru) that calculates business day status for any day, month or year, or for an arbitrary time period no longer than 366 days.

## Installation

```bash
npm install isdayoff-ts --save
```

## Usage

```ts
import IsDayOff from 'isdayoff-ts';

/** returns false if today is a business day or true if it's not */
isDayOff
  .date()
  .then((res) => console.log(`${date} is a ${res ? 'non-' : ''}working day.`))
  .catch((err) => console.log(err.message));

/** returns false if September 10 is a business day or true if it's not */
const date = new Date('2020-09-10');
isDayOff
  .date(date)
  .then((res) => console.log(`${date} is a ${res ? 'non-' : ''}working day.`))
  .catch((err) => console.log(err.message));

/** returns an array of business/non-business days for September 2020 @example [0,1,1,0] */
isDayOff
  .month(new Date(2020, 8))
  .then((res) => {
    res.forEach((v, i) => {
      console.log(
        `${i + 1}.${date.getMonth() + 1}.${date.getFullYear()} is a ${v ? 'non-' : ''}working day.`,
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
        `Day ${i + 1} in year ${date.getFullYear()} is a ${v ? 'non-' : ''}working day.`,
      );
    });
  })
  .catch((err) => console.log(err.message));

// returns an array of business/non-business days for an interval
isDayOff
  .interval(new Date('2020-09-10'), new Date('2020-09-15'))
  .then((res) => console.log(res))
  .catch((err) => console.log(err.message));

```

## License

MIT
