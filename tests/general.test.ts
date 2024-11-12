import { IsDayOffAPI } from '../src/api';

const IsDayOff = new IsDayOffAPI();

describe('IsDayOffAPI tests', () => {
  it('today', async () => {
    const res = await IsDayOff.today();

    expect(res).toBeLessThanOrEqual(5);
  });

  it('month', async () => {
    const res = await IsDayOff.month({ month: 9 });

    expect(res.length).toBeGreaterThanOrEqual(30);
  });

  it('year', async () => {
    const res = await IsDayOff.year({ year: 2020 });

    expect(res.length).toBe(366);
  });

  it('date', async () => {
    const res = await IsDayOff.date({
      year: 1970,
      month: 9,
      date: 10,
      pre: true,
    });

    expect(res).toBe(0);
  });

  it('period', async () => {
    const expected = '001100';

    const start = new Date();
    start.setDate(10);
    start.setMonth(8);
    start.setFullYear(2020);

    const end = new Date();
    end.setDate(15);
    end.setMonth(8);
    end.setFullYear(2020);

    const res = await IsDayOff.period({ start, end });

    expect(res.length).toBe(expected.length);
    expect(res).toEqual(expected.split('').map((item) => Number(item)));
  });
});
