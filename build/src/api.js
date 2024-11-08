"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsDayOffAPI = void 0;
const debug_1 = __importDefault(require("debug"));
const axios_1 = __importDefault(require("axios"));
const debug = (0, debug_1.default)('isdayoff');
const formatDate = (date) => {
    const y = `0000${date.getFullYear()}`.slice(-4);
    const m = `00${date.getMonth() + 1}`.slice(-2);
    const d = `00${date.getDate()}`.slice(-2);
    return `${y}${m}${d}`;
};
class IsDayOffAPI {
    async today(options = {}) {
        const now = new Date();
        const res = await this.getRawData({
            ...options,
            year: now.getFullYear(),
            month: now.getMonth(),
            day: now.getDate(),
        });
        return Number(res);
    }
    async month({ year = new Date().getFullYear(), month = new Date().getMonth(), ...options } = {
        year: new Date().getFullYear(),
        month: new Date().getMonth(),
    }) {
        return this.getData({ year, month, ...options });
    }
    async year({ year = new Date().getFullYear(), ...options } = {
        year: new Date().getFullYear(),
    }) {
        return this.getData({ year, ...options });
    }
    async day({ year = new Date().getFullYear(), month = new Date().getMonth(), day = new Date().getDate(), ...options } = {
        year: new Date().getFullYear(),
        month: new Date().getMonth(),
        day: new Date().getDate(),
    }) {
        return Number(await this.getRawData({
            year,
            month,
            day,
            ...options,
        }));
    }
    async period({ start, end, ...options }) {
        console.log({ start, end });
        const res = await this.getRawData({ start, end, ...options });
        console.log({ res });
        return res.split('').map((item) => Number(item));
    }
    async getData({ year = new Date().getFullYear(), ...options }) {
        const res = await this.getRawData({ year, ...options });
        return res.split('').map((item) => Number(item));
    }
    // eslint-disable-next-line class-methods-use-this
    async getRawData(options) {
        return await this.callApi(options);
    }
    async callApi({ year, month, day, start, end, country, pre, covid, }) {
        let url = 'https://isdayoff.ru';
        if (year) {
            url += `/api/getdata?year=${year}`;
            if (month) {
                url += `&month=${`00${month + 1}`.slice(-2)}`;
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
        console.log({ url });
        const { data } = await axios_1.default.get(url, { responseType: 'text' });
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
exports.IsDayOffAPI = IsDayOffAPI;
exports.default = IsDayOffAPI;
//# sourceMappingURL=api.js.map