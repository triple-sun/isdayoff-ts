import { IsDayOffValue } from "./enum";
import { IsDayOff, IsDayOffApi } from "./isdayoff";

describe("IsDayOffAPI tests", () => {
  const isDayOff = new IsDayOffApi("https://isdayoff.ru");
  const TEST_DATE = new Date("2026-01-01");
  const TEST_DATE_START = new Date("2025-12-27");
  const TEST_EXPECTED = [
    new IsDayOff(IsDayOffValue.DayOff),
    new IsDayOff(IsDayOffValue.DayOff),
    new IsDayOff(IsDayOffValue.BusinessDay),
    new IsDayOff(IsDayOffValue.BusinessDay),
    new IsDayOff(IsDayOffValue.DayOff),
    new IsDayOff(IsDayOffValue.DayOff),
  ];

  it("should get for today", async () => {
    const res = await isDayOff.today();

    expect(res).toBeInstanceOf(IsDayOff);
    expect(res.value()).toBeGreaterThanOrEqual(0);
  });

  it("should get for tomorrow", async () => {
    const res = await isDayOff.tomorrow();

    expect(res.value()).toBeGreaterThanOrEqual(0);
  });

  it("should get for date", async () => {
    const res = await isDayOff.day(TEST_DATE);

    expect(res?.value()).toEqual(IsDayOffValue.DayOff);
  });

  it("should get for date (holiday)", async () => {
    const res = await isDayOff.day(TEST_DATE, { holiday: true });

    expect(res?.value()).toEqual(IsDayOffValue.Holiday);
  });

  it("should get for month", async () => {
    const res = await isDayOff.month(TEST_DATE);

    expect(res.length).toBeGreaterThanOrEqual(30);
    expect(res[0]?.value()).toBe(1);
  });

  it("should get for year", async () => {
    const res = await isDayOff.year(TEST_DATE);

    expect(res.length).toBeLessThanOrEqual(366);
    expect(res.length).toBeGreaterThanOrEqual(365);
    expect(res[0]?.value()).toEqual(IsDayOffValue.DayOff);
  });

  it("should get for an interval", async () => {
    const res = await isDayOff.interval(TEST_DATE_START, TEST_DATE);

    expect(res).toEqual(TEST_EXPECTED);
  });

  it("should throw if interval is too long", async () => {
    await expect(
      isDayOff.interval(new Date("2020-01-01"), new Date("2023-01-01"))
    ).rejects.toThrow("Interval error: interval longer than 366 days");
  });

  it("should simplify to boolean", () => {
    const businessDay = new IsDayOff(IsDayOffValue.BusinessDay);
    const dayOff = new IsDayOff(IsDayOffValue.DayOff);
    const shortDay = new IsDayOff(IsDayOffValue.ShortDay);
    const covidDay = new IsDayOff(IsDayOffValue.CovidBusinessDay);
    const holiday = new IsDayOff(IsDayOffValue.Holiday);

    expect(businessDay.bool()).toBe(false);
    expect(dayOff.bool()).toBe(true);
    expect(shortDay.bool()).toBe(false);
    expect(covidDay.bool()).toBe(false);
    expect(holiday.bool()).toBe(true);
  });

  it("should check for leap year", async () => {
    const res = await isDayOff.isLeapYear(TEST_DATE);

    expect(res).toBe(true);
  });
});
