import IsDayOffAPI from "../src/api";


describe('IsDayOffAPI tests', () => {
  it('today', async () => {
    const api = new IsDayOffAPI();
    const res = await api.today();

    expect(res).toBeLessThanOrEqual(5);
  });

  it('month', async () => {
    const api = new IsDayOffAPI();
    const res = await api.month({ month: 9 });

    expect(res.length).toBeGreaterThanOrEqual(30);
  });

  it('year', async () => {
    const api = new IsDayOffAPI();
    const res = await api.year({ year: 2020 });

    expect(res.length).toBe(366);
  });

  it('day', async () => {
    const api = new IsDayOffAPI();

    const res = await api.day({
      year: 1970,
      month: 9,
      day: 10,
      pre: true,
    });

    expect(res).toBe(0);
  });

  it('period', async () => {
    const api = new IsDayOffAPI();

    const expected = '001100';

    const start = new Date();
    start.setDate(10);
    start.setMonth(8);
    start.setFullYear(2020);

    const end = new Date();
    end.setDate(15);
    end.setMonth(8);
    end.setFullYear(2020);

    const res = await api.period({ start, end });

    expect(res.length).toBe(expected.length);
    expect(res).toEqual(expected.split('').map((item) => Number(item)));
  });
});
