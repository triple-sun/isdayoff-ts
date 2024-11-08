"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const api_1 = __importDefault(require("../src/api"));
describe('IsDayOffAPI tests', () => {
    it('today', async () => {
        const api = new api_1.default();
        const res = await api.today();
        expect(res).toBeLessThanOrEqual(5);
    });
    it('month', async () => {
        const api = new api_1.default();
        const res = await api.month({ month: 8 });
        expect(res.length).toBeGreaterThanOrEqual(30);
    });
    it('year', async () => {
        const api = new api_1.default();
        const res = await api.year({ year: 2020 });
        expect(res.length).toBe(366);
    });
    it('day', async () => {
        const api = new api_1.default();
        const res = await api.day({
            year: 1970,
            month: 8,
            day: 10,
            pre: true,
        });
        expect(res).toBe(0);
    });
    it('period', async () => {
        const api = new api_1.default();
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
//# sourceMappingURL=general.test.js.map