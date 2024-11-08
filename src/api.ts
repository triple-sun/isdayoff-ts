import Debug from 'debug';
import {
  CallApiBase,
  CallApiOptions,
  DayOptions,
  MonthOptions,
  PeriodOptions,
} from './types';
import axios from 'axios';

const debug = Debug('isdayoff');

const formatDate = (date: Date) => {
  const y = `0000${date.getFullYear()}`.slice(-4);
  const m = `00${date.getMonth() + 1}`.slice(-2);
  const d = `00${date.getDate()}`.slice(-2);
  return `${y}${m}${d}`;
};

export class IsDayOffAPI {
  public async today(options: CallApiBase = {}) {
    const now = new Date();
    const res = await this.getRawData({
      ...options,
      year: now.getFullYear(),
      month: now.getMonth(),
      day: now.getDate(),
    });

    return Number(res);
  }

  public async day(
    {
      year = new Date().getFullYear(),
      month = new Date().getMonth() + 1,
      day = new Date().getDate(),
      ...options
    }: DayOptions = {
      year: new Date().getFullYear(),
      month: new Date().getMonth(),
      day: new Date().getDate(),
    },
  ) {
    return Number(
      await this.getRawData({
        year,
        month,
        day,
        ...options,
      }),
    );
  }

  public async month(
    {
      year = new Date().getFullYear(),
      month = new Date().getMonth() + 1,
      ...options
    }: MonthOptions = {
      year: new Date().getFullYear(),
      month: new Date().getMonth(),
    },
  ) {
    return this.getData({ year, month, ...options });
  }

  public async year(
    {
      year = new Date().getFullYear(),
      ...options
    }: Pick<CallApiOptions, 'year'> & CallApiBase = {
      year: new Date().getFullYear(),
    },
  ) {
    return this.getData({ year, ...options });
  }

  public async period({ start, end, ...options }: PeriodOptions) {
    const res = await this.getRawData({ start, end, ...options });
    return res.split('').map((item) => Number(item));
  }

  private async getData({ year = new Date().getFullYear(), ...options }) {
    const res = await this.getRawData({ year, ...options });
    return res.split('').map((item) => Number(item));
  }

  // eslint-disable-next-line class-methods-use-this
  private async getRawData(options: CallApiOptions) {
    return await this.callApi(options);
  }

  private async callApi({
    year,
    month,
    day,
    start,
    end,
    country,
    pre,
    covid,
  }: CallApiOptions): Promise<string> {
    let url = 'https://isdayoff.ru';

    if (year) {
      url += `/api/getdata?year=${year}`;
      if (month) {
        url += `&month=${`00${month}`.slice(-2)}`;
        if (day) {
          url += `&day=${`00${day}`.slice(-2)}`;
        }
      }
    }
    if (start) {
      url += `/api/getdata?date1=${formatDate(start)}`;
      if (end) {
        url += `&date2=${formatDate(end)}`;
      }
    }

    if (country) {
      url += `&cc=${country}`;
    }
    if (pre) {
      url += `&pre=${pre ? 1 : 0}`;
    }
    if (covid) {
      url += `&covid=${covid ? 1 : 0}`;
    }

    debug(`URL: ${url}`);

    const { data } = await axios.get(url, { responseType: 'text' });

    switch (data) {
      case '100':
        throw new Error('Invalid date (response code: 100)');
      case '101':
        throw new Error('Data not found (response code: 101)');
      case '199':
        throw new Error('Service error (response code: 199)');
      default: {
        if (!/[0124]+/.test(data)) {
          throw new Error(`Unexpected response: ${data}`);
        }

        return data;
      }
    }
  }
}

export default IsDayOffAPI;
