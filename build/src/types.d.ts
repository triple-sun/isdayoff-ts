type Year = {
    /** Год */
    year?: number;
};
type Day = {
    /** Число */
    day?: number;
};
type Month = {
    /** Месяц */
    month?: number;
};
type Period = {
    /** Начало периода */
    start?: Date;
    /** Конец периода */
    end?: Date;
};
export type CallApiBase = {
    /** Код страны (по-умолчанию Россия) */
    country?: string;
    /** Помечать сокращённые рабочие дни цифрой 2 */
    pre?: boolean;
    /** Помечать рабочие дни цифрой 4 (в связи с пандемией COVID-19) */
    covid?: boolean;
};
export type CallApiOptions = Day & Year & Month & Period & CallApiBase;
export type DateOptions = Day & Month & Year & CallApiBase;
export type MonthOptions = Month & Year & CallApiBase;
export type YearOptions = Year & CallApiBase;
export type PeriodOptions = Period & CallApiBase;
export {};
//# sourceMappingURL=types.d.ts.map