import isDayOff, { IsDayOffValue } from "./index";
import { IsDayOff } from "./isdayoff";

describe("Module Exports", () => {
	it("should export default singleton instance", () => {
		expect(isDayOff).toBeInstanceOf(IsDayOff);
		expect(isDayOff.url).toBe("https://isdayoff.ru");
	});

	it("should export IsDayOffValue enum", () => {
		expect(IsDayOffValue.BusinessDay).toBe(0);
		expect(IsDayOffValue.DayOff).toBe(1);
		expect(IsDayOffValue.ShortDay).toBe(2);
		expect(IsDayOffValue.CovidBusinessDay).toBe(4);
		expect(IsDayOffValue.Holiday).toBe(8);
	});
});
