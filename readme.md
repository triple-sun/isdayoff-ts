# IsDayOff-TS

IsDayOff-TS is a TypeScript fork of [isdayoff](https://www.npmjs.com/package/isdayoff), an API wrapper for [isdayoff.ru](https://isdayoff.ru) that calculates business day status for any day, month or year, or for an arbitrary time period no longer than 366 days.

## Installation

```bash
npm install isdayoff --save
```

## Usage

```ts
import api from 'isdayoff-ts';
// Alternatively API object can be cerated:
// import { IsDayOffAPI } from 'isdayoff-ts'
// const api = new IsDayOffAPI();

// returns is today wokring/non-working day
api
  .today()
  .then((res) => console.log(`Today is ${res ? 'non-' : ''}working day.`))
  .catch((err) => console.log(err.message));

// returns arrray of wokring/non-working day for September 10
api
  .date({ month: 8, date: 10 })
  .then((res) => console.log(`10.09 is ${res ? 'non-' : ''}working day.`))
  .catch((err) => console.log(err.message));

// returns arrray of wokring/non-working day for September
api
  .month({ month: 8 })
  .then((res) => console.log(JSON.stringify(res)))
  .catch((err) => console.log(err.message));

// returns arrray of wokring/non-working day for 2021
api
  .year({ year: 2021 })
  .then((res) => console.log(JSON.stringify(res)))
  .catch((err) => console.log(err.message));

// returns arrray of wokring/non-working day for periodd
api
  .period({
    start: new Date('2020-09-10'),
    end: new Date('2020-09-15'),
  })
  .then((res) => console.log(JSON.stringify(res)))
  .catch((err) => console.log(err.message));
```

## License

MIT
