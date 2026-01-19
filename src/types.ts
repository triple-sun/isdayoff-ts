import type { IsDayOffCallType } from "./enum";

export type IsDayOffApiOptions = {
	/** Country code (default: RU) */
	cc?: string;
	/** use 2 for short days @default false */
	pre?: boolean;
	/** use 5 for covid-era workdays @default false */
	covid?: boolean;
	/** use 8 for holidays */
	holiday?: boolean;
	/** use 6-day workweek */
	sd?: boolean;
};

export type IsDayOffAliasOptions = {
	type: IsDayOffCallType.Today | IsDayOffCallType.Tomorrow;
};

export type IsDayOffDateOptions = {
	type: IsDayOffCallType.Day;
	day: string;
	month: string;
	year: string;
} & IsDayOffApiOptions;

export type IsDayOffMonthOptions = {
	type: IsDayOffCallType.Month;
	month: string;
	year: string;
} & IsDayOffApiOptions;

export type IsDayOffYearOptions = {
	type: IsDayOffCallType.Year;
	year: string;
} & IsDayOffApiOptions;

export type IsDayOffIntervalOptions = {
	type: IsDayOffCallType.Interval;
	date1: string;
	date2: string;
} & IsDayOffApiOptions;

export type IsLeapYearApiOptions = {
	type: IsDayOffCallType.LeapYear;
	year: string;
};

export type CallApiOptions =
	| IsDayOffAliasOptions
	| IsDayOffDateOptions
	| IsDayOffMonthOptions
	| IsDayOffYearOptions
	| IsDayOffIntervalOptions
	| IsLeapYearApiOptions;
