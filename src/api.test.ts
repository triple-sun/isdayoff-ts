import { IsDayOffAPI } from "./api";

describe("IsDayOffAPI tests", () => {
  const isDayOff = new IsDayOffAPI();
  const TEST_DATE = new Date(2020, 0, 1);
  const TEST_DATE_START = new Date(2019, 11, 27);
  const TEST_EXPECTED = [false, true, true, false, false, true];

  it("should get for date", async () => {
    const res = await isDayOff.date(TEST_DATE);

    expect(res).toBe(true);
  });

  it("should get for month", async () => {
    const res = await isDayOff.month(TEST_DATE);

    expect(res.length).toBeGreaterThanOrEqual(30);
    expect(res[0]).toBe(true);
  });

  it("should get for year", async () => {
    const res = await isDayOff.year(TEST_DATE);

    expect(res.length).toBeLessThanOrEqual(366);
    expect(res.length).toBeGreaterThanOrEqual(365);
    expect(res[0]).toBe(true);
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
});
