import { IsDayOffValue } from "./enum";
import { IsDayOff, IsDayOffDay } from "./isdayoff";

describe("IsDayOffAPI tests", () => {
	const isDayOff = new IsDayOff("https://isdayoff.ru");
	const TEST_DATE = new Date("2026-01-01");
	const TEST_DATE_START = new Date("2025-12-27");
	const TEST_EXPECTED = [
		new IsDayOffDay(IsDayOffValue.DayOff),
		new IsDayOffDay(IsDayOffValue.DayOff),
		new IsDayOffDay(IsDayOffValue.BusinessDay),
		new IsDayOffDay(IsDayOffValue.BusinessDay),
		new IsDayOffDay(IsDayOffValue.DayOff),
		new IsDayOffDay(IsDayOffValue.DayOff),
	];

	it("should get for today", async () => {
		const res = await isDayOff.today();

		expect(res).toBeInstanceOf(IsDayOffDay);
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
			isDayOff.interval(new Date("2020-01-01"), new Date("2023-01-01")),
		).rejects.toThrow("Interval error: interval longer than 366 days");
	});

	it("should simplify to boolean", () => {
		const businessDay = new IsDayOffDay(IsDayOffValue.BusinessDay);
		const dayOff = new IsDayOffDay(IsDayOffValue.DayOff);
		const shortDay = new IsDayOffDay(IsDayOffValue.ShortDay);
		const covidDay = new IsDayOffDay(IsDayOffValue.CovidBusinessDay);
		const holiday = new IsDayOffDay(IsDayOffValue.Holiday);

		expect(businessDay.bool()).toBe(false);
		expect(dayOff.bool()).toBe(true);
		expect(shortDay.bool()).toBe(false);
		expect(covidDay.bool()).toBe(false);
		expect(holiday.bool()).toBe(true);
	});

	it("should check for leap year", async () => {
		const res = await isDayOff.isLeapYear(TEST_DATE);

		// 2026 is not a leap year
		expect(res).toBe(false);
	});
});

describe("IsDayOff Configuration", () => {
	it("should set and get URL", () => {
		const isDayOff = new IsDayOff("https://isdayoff.ru");

		expect(isDayOff.url).toBe("https://isdayoff.ru");

		isDayOff.setUrl("https://custom.api.com");
		expect(isDayOff.url).toBe("https://custom.api.com");
	});

	it("should support method chaining with setUrl", () => {
		const isDayOff = new IsDayOff("https://isdayoff.ru");

		const result = isDayOff.setUrl("https://new.url.com");
		expect(result).toBe(isDayOff);
		expect(isDayOff.url).toBe("https://new.url.com");
	});
});

describe("IsDayOff API Error Handling", () => {
	let isDayOff: IsDayOff;
	let originalFetch: typeof global.fetch;

	beforeEach(() => {
		isDayOff = new IsDayOff("https://isdayoff.ru");
		originalFetch = global.fetch;
	});

	afterEach(() => {
		global.fetch = originalFetch;
	});

	it("should throw error for invalid date (code 100)", async () => {
		global.fetch = jest.fn().mockResolvedValue({
			text: async () => "100",
		} as Response);

		await expect(isDayOff.today()).rejects.toThrow("[100]: Invalid date");
	});

	it("should throw error for data not found (code 101)", async () => {
		global.fetch = jest.fn().mockResolvedValue({
			text: async () => "101",
		} as Response);

		await expect(isDayOff.today()).rejects.toThrow("[101]: Data not found");
	});

	it("should throw error for service error (code 199)", async () => {
		global.fetch = jest.fn().mockResolvedValue({
			text: async () => "199",
		} as Response);

		await expect(isDayOff.today()).rejects.toThrow("[199]: Service error");
	});

	it("should throw error for unexpected response format", async () => {
		global.fetch = jest.fn().mockResolvedValue({
			text: async () => "abc",
		} as Response);

		await expect(isDayOff.today()).rejects.toThrow(
			"Unexpected response: [abc]",
		);
	});

	it("should throw error for invalid response with special characters", async () => {
		global.fetch = jest.fn().mockResolvedValue({
			text: async () => "3579",
		} as Response);

		await expect(isDayOff.today()).rejects.toThrow(
			"Unexpected response: [3579]",
		);
	});
});

describe("IsDayOff API Options", () => {
	let isDayOff: IsDayOff;
	let originalFetch: typeof global.fetch;
	let fetchMock: jest.Mock;

	beforeEach(() => {
		isDayOff = new IsDayOff("https://isdayoff.ru");
		originalFetch = global.fetch;
		fetchMock = jest.fn().mockResolvedValue({
			text: async () => "0",
		} as Response);
		global.fetch = fetchMock;
	});

	afterEach(() => {
		global.fetch = originalFetch;
	});

	it("should include country code in query", async () => {
		await isDayOff.today({ cc: "us" });

		expect(fetchMock).toHaveBeenCalledWith(expect.stringContaining("cc=us"));
	});

	it("should include pre (short days) option in query", async () => {
		await isDayOff.today({ pre: true });

		expect(fetchMock).toHaveBeenCalledWith(expect.stringContaining("pre=1"));
	});

	it("should include covid option in query", async () => {
		await isDayOff.today({ covid: true });

		expect(fetchMock).toHaveBeenCalledWith(expect.stringContaining("covid=1"));
	});

	it("should include holiday option in query", async () => {
		await isDayOff.today({ holiday: true });

		expect(fetchMock).toHaveBeenCalledWith(
			expect.stringContaining("holiday=1"),
		);
	});

	it("should include sd (6-day workweek) option in query", async () => {
		await isDayOff.today({ sd: true });

		expect(fetchMock).toHaveBeenCalledWith(expect.stringContaining("sd=1"));
	});

	it("should include multiple options in query", async () => {
		await isDayOff.today({ cc: "kz", pre: true, sd: true });

		const callUrl = fetchMock.mock.calls[0][0] as string;
		expect(callUrl).toContain("cc=kz");
		expect(callUrl).toContain("pre=1");
		expect(callUrl).toContain("sd=1");
	});

	it("should not include false boolean options", async () => {
		await isDayOff.today({ pre: false, covid: false });

		const callUrl = fetchMock.mock.calls[0][0] as string;
		expect(callUrl).not.toContain("pre=");
		expect(callUrl).not.toContain("covid=");
	});

	it("should handle options with day method", async () => {
		await isDayOff.day(new Date("2026-01-01"), { cc: "by", holiday: true });

		const callUrl = fetchMock.mock.calls[0][0] as string;
		expect(callUrl).toContain("cc=by");
		expect(callUrl).toContain("holiday=1");
	});

	it("should handle options with month method", async () => {
		await isDayOff.month(new Date("2026-01-01"), { cc: "ua", pre: true });

		const callUrl = fetchMock.mock.calls[0][0] as string;
		expect(callUrl).toContain("cc=ua");
		expect(callUrl).toContain("pre=1");
	});

	it("should handle options with year method", async () => {
		fetchMock.mockResolvedValue({
			text: async () => "0".repeat(365),
		} as Response);

		await isDayOff.year(new Date("2026-01-01"), {
			cc: "kz",
			covid: true,
		});

		const callUrl = fetchMock.mock.calls[0][0] as string;
		expect(callUrl).toContain("cc=kz");
		expect(callUrl).toContain("covid=1");
	});

	it("should handle options with interval method", async () => {
		fetchMock.mockResolvedValue({
			text: async () => "010101",
		} as Response);

		await isDayOff.interval(new Date("2026-01-01"), new Date("2026-01-06"), {
			cc: "ru",
			sd: true,
		});

		const callUrl = fetchMock.mock.calls[0][0] as string;
		expect(callUrl).toContain("cc=ru");
		expect(callUrl).toContain("sd=1");
	});
});

describe("IsDayOffDay Value Parsing", () => {
	let isDayOff: IsDayOff;
	let originalFetch: typeof global.fetch;

	beforeEach(() => {
		isDayOff = new IsDayOff("https://isdayoff.ru");
		originalFetch = global.fetch;
	});

	afterEach(() => {
		global.fetch = originalFetch;
	});

	it("should parse valid IsDayOffValue enum values", async () => {
		// Test BusinessDay
		global.fetch = jest.fn().mockResolvedValue({
			text: async () => "0",
		} as Response);
		let result = await isDayOff.today();
		expect(result.value()).toBe(IsDayOffValue.BusinessDay);

		// Test DayOff
		global.fetch = jest.fn().mockResolvedValue({
			text: async () => "1",
		} as Response);
		result = await isDayOff.today();
		expect(result.value()).toBe(IsDayOffValue.DayOff);

		// Test ShortDay
		global.fetch = jest.fn().mockResolvedValue({
			text: async () => "2",
		} as Response);
		result = await isDayOff.today();
		expect(result.value()).toBe(IsDayOffValue.ShortDay);

		// Test CovidBusinessDay
		global.fetch = jest.fn().mockResolvedValue({
			text: async () => "4",
		} as Response);
		result = await isDayOff.today();
		expect(result.value()).toBe(IsDayOffValue.CovidBusinessDay);

		// Test Holiday
		global.fetch = jest.fn().mockResolvedValue({
			text: async () => "8",
		} as Response);
		result = await isDayOff.today();
		expect(result.value()).toBe(IsDayOffValue.Holiday);
	});

	it("should throw error for invalid enum value", async () => {
		global.fetch = jest.fn().mockResolvedValue({
			text: async () => "3",
		} as Response);

		await expect(isDayOff.today()).rejects.toThrow("Unexpected response: [3]");
	});

	it("should throw error for invalid enum value (9)", async () => {
		global.fetch = jest.fn().mockResolvedValue({
			text: async () => "9",
		} as Response);

		await expect(isDayOff.today()).rejects.toThrow("Unexpected response: [9]");
	});
});

describe("IsDayOff Date Formatting", () => {
	let isDayOff: IsDayOff;
	let originalFetch: typeof global.fetch;
	let fetchMock: jest.Mock;

	beforeEach(() => {
		isDayOff = new IsDayOff("https://isdayoff.ru");
		originalFetch = global.fetch;
		fetchMock = jest.fn().mockResolvedValue({
			text: async () => "0",
		} as Response);
		global.fetch = fetchMock;
	});

	afterEach(() => {
		global.fetch = originalFetch;
	});

	it("should format single-digit day correctly", async () => {
		await isDayOff.day(new Date("2026-01-05"));

		expect(fetchMock).toHaveBeenCalledWith(expect.stringContaining("day=05"));
	});

	it("should format double-digit day correctly", async () => {
		await isDayOff.day(new Date("2026-01-25"));

		expect(fetchMock).toHaveBeenCalledWith(expect.stringContaining("day=25"));
	});

	it("should format single-digit month correctly", async () => {
		await isDayOff.day(new Date("2026-03-15"));

		expect(fetchMock).toHaveBeenCalledWith(expect.stringContaining("month=03"));
	});

	it("should format double-digit month correctly", async () => {
		await isDayOff.day(new Date("2026-11-15"));

		expect(fetchMock).toHaveBeenCalledWith(expect.stringContaining("month=11"));
	});

	it("should format year correctly", async () => {
		await isDayOff.day(new Date("2026-01-01"));

		expect(fetchMock).toHaveBeenCalledWith(
			expect.stringContaining("year=2026"),
		);
	});

	it("should format full date correctly in interval", async () => {
		fetchMock.mockResolvedValue({
			text: async () => "01",
		} as Response);

		await isDayOff.interval(new Date("2026-01-05"), new Date("2026-01-06"));

		const callUrl = fetchMock.mock.calls[0][0] as string;
		expect(callUrl).toContain("date1=20260105");
		expect(callUrl).toContain("date2=20260106");
	});

	it("should format edge case dates correctly", async () => {
		// First day of year
		await isDayOff.day(new Date("2026-01-01"));
		let callUrl = fetchMock.mock.calls[0][0] as string;
		expect(callUrl).toContain("year=2026");
		expect(callUrl).toContain("month=01");
		expect(callUrl).toContain("day=01");

		// Last day of year
		await isDayOff.day(new Date("2026-12-31"));
		callUrl = fetchMock.mock.calls[1][0] as string;
		expect(callUrl).toContain("year=2026");
		expect(callUrl).toContain("month=12");
		expect(callUrl).toContain("day=31");
	});
});

describe("IsDayOff Endpoint Preparation", () => {
	let isDayOff: IsDayOff;
	let originalFetch: typeof global.fetch;
	let fetchMock: jest.Mock;

	beforeEach(() => {
		isDayOff = new IsDayOff("https://isdayoff.ru");
		originalFetch = global.fetch;
		fetchMock = jest.fn().mockResolvedValue({
			text: async () => "0",
		} as Response);
		global.fetch = fetchMock;
	});

	afterEach(() => {
		global.fetch = originalFetch;
	});

	it("should use 'today' endpoint for today method", async () => {
		await isDayOff.today();

		expect(fetchMock).toHaveBeenCalledWith(expect.stringContaining("/today?"));
	});

	it("should use 'tomorrow' endpoint for tomorrow method", async () => {
		await isDayOff.tomorrow();

		expect(fetchMock).toHaveBeenCalledWith(
			expect.stringContaining("/tomorrow?"),
		);
	});

	it("should use 'api/getdata' endpoint for day method", async () => {
		await isDayOff.day(new Date("2026-01-01"));

		expect(fetchMock).toHaveBeenCalledWith(
			expect.stringContaining("/api/getdata?"),
		);
	});

	it("should use 'api/getdata' endpoint for month method", async () => {
		await isDayOff.month(new Date("2026-01-01"));

		expect(fetchMock).toHaveBeenCalledWith(
			expect.stringContaining("/api/getdata?"),
		);
	});

	it("should use 'api/getdata' endpoint for year method", async () => {
		fetchMock.mockResolvedValue({
			text: async () => "0".repeat(365),
		} as Response);

		await isDayOff.year(new Date("2026-01-01"));

		expect(fetchMock).toHaveBeenCalledWith(
			expect.stringContaining("/api/getdata?"),
		);
	});

	it("should use 'api/getdata' endpoint for interval method", async () => {
		fetchMock.mockResolvedValue({
			text: async () => "010101",
		} as Response);

		await isDayOff.interval(new Date("2026-01-01"), new Date("2026-01-06"));

		expect(fetchMock).toHaveBeenCalledWith(
			expect.stringContaining("/api/getdata?"),
		);
	});

	it("should use 'api/isleap' endpoint for isLeapYear method", async () => {
		await isDayOff.isLeapYear(new Date("2026-01-01"));

		expect(fetchMock).toHaveBeenCalledWith(
			expect.stringContaining("/api/isleap?"),
		);
	});
});

describe("IsDayOff Leap Year", () => {
	let isDayOff: IsDayOff;
	let originalFetch: typeof global.fetch;

	beforeEach(() => {
		isDayOff = new IsDayOff("https://isdayoff.ru");
		originalFetch = global.fetch;
	});

	afterEach(() => {
		global.fetch = originalFetch;
	});

	it("should return true for leap year", async () => {
		global.fetch = jest.fn().mockResolvedValue({
			text: async () => "1",
		} as Response);

		const result = await isDayOff.isLeapYear(new Date("2024-01-01"));
		expect(result).toBe(true);
	});

	it("should return false for non-leap year", async () => {
		global.fetch = jest.fn().mockResolvedValue({
			text: async () => "0",
		} as Response);

		const result = await isDayOff.isLeapYear(new Date("2023-01-01"));
		expect(result).toBe(false);
	});

	it("should use current year when no date provided", async () => {
		const fetchMock = jest.fn().mockResolvedValue({
			text: async () => "0",
		} as Response);
		global.fetch = fetchMock;

		await isDayOff.isLeapYear();

		const currentYear = new Date().getFullYear();
		expect(fetchMock).toHaveBeenCalledWith(
			expect.stringContaining(`year=${currentYear}`),
		);
	});
});

describe("IsDayOff Response Formatting", () => {
	let isDayOff: IsDayOff;
	let originalFetch: typeof global.fetch;

	beforeEach(() => {
		isDayOff = new IsDayOff("https://isdayoff.ru");
		originalFetch = global.fetch;
	});

	afterEach(() => {
		global.fetch = originalFetch;
	});

	it("should format interval response with multiple values", async () => {
		global.fetch = jest.fn().mockResolvedValue({
			text: async () => "0120418",
		} as Response);

		const result = await isDayOff.interval(
			new Date("2026-01-01"),
			new Date("2026-01-07"),
		);

		expect(result).toHaveLength(7);
		expect(result[0]?.value()).toBe(IsDayOffValue.BusinessDay);
		expect(result[1]?.value()).toBe(IsDayOffValue.DayOff);
		expect(result[2]?.value()).toBe(IsDayOffValue.ShortDay);
		expect(result[3]?.value()).toBe(IsDayOffValue.BusinessDay);
		expect(result[4]?.value()).toBe(IsDayOffValue.CovidBusinessDay);
		expect(result[5]?.value()).toBe(IsDayOffValue.DayOff);
		expect(result[6]?.value()).toBe(IsDayOffValue.Holiday);
	});

	it("should format month response correctly", async () => {
		global.fetch = jest.fn().mockResolvedValue({
			text: async () => "0101010101010101010101010101010",
		} as Response);

		const result = await isDayOff.month(new Date("2026-01-01"));

		expect(result).toHaveLength(31);
		result.forEach((day, index) => {
			expect(day.value()).toBe(
				index % 2 === 0 ? IsDayOffValue.BusinessDay : IsDayOffValue.DayOff,
			);
		});
	});
});

describe("IsDayOff Input Validation", () => {
	let isDayOff: IsDayOff;

	beforeEach(() => {
		isDayOff = new IsDayOff("https://isdayoff.ru");
	});

	it("should throw error for invalid Date object in day()", async () => {
		await expect(isDayOff.day(new Date("invalid"))).rejects.toThrow(
			"Invalid date provided",
		);
	});

	it("should throw error for invalid Date object in month()", async () => {
		await expect(isDayOff.month(new Date("invalid"))).rejects.toThrow(
			"Invalid date provided",
		);
	});

	it("should throw error for invalid Date object in year()", async () => {
		await expect(isDayOff.year(new Date("invalid"))).rejects.toThrow(
			"Invalid date provided",
		);
	});

	it("should throw error for invalid Date object in isLeapYear()", async () => {
		await expect(isDayOff.isLeapYear(new Date("invalid"))).rejects.toThrow(
			"Invalid date provided",
		);
	});

	it("should throw error for invalid start date in interval()", async () => {
		await expect(
			isDayOff.interval(new Date("invalid"), new Date("2026-01-01")),
		).rejects.toThrow("Invalid date provided");
	});

	it("should throw error for invalid end date in interval()", async () => {
		await expect(
			isDayOff.interval(new Date("2026-01-01"), new Date("invalid")),
		).rejects.toThrow("Invalid date provided");
	});

	it("should throw error when start date is after end date", async () => {
		await expect(
			isDayOff.interval(new Date("2026-01-10"), new Date("2026-01-01")),
		).rejects.toThrow(
			"Interval error: start date must be before or equal to end date",
		);
	});

	it("should allow start date equal to end date", async () => {
		const date = new Date("2026-01-01");
		const result = await isDayOff.interval(date, date);
		expect(result).toHaveLength(1);
	});
});
