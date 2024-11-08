import { CallApiBase, CallApiOptions, DateOptions, MonthOptions, PeriodOptions } from './types';
export declare class IsDayOffAPI {
    today(options?: CallApiBase): Promise<number>;
    month({ year, month, ...options }?: MonthOptions): Promise<number[]>;
    year({ year, ...options }?: Pick<CallApiOptions, 'year'> & CallApiBase): Promise<number[]>;
    day({ year, month, day, ...options }?: DateOptions): Promise<number>;
    period({ start, end, ...options }: PeriodOptions): Promise<number[]>;
    private getData;
    private getRawData;
    private callApi;
}
export default IsDayOffAPI;
//# sourceMappingURL=api.d.ts.map