import { IsDayOffCallType, IsDayOffValue } from "./enum";
import type { CallApiOptions, IsDayOffApiOptions } from "./types";

export class IsDayOffDay {
	readonly #value: Readonly<IsDayOffValue>;

	constructor(v: IsDayOffValue) {
		this.#value = v;
	}

	public value(): Readonly<IsDayOffValue> {
		return this.#value;
	}

	public bool(): Readonly<boolean> {
		switch (this.#value) {
			case IsDayOffValue.DayOff:
			case IsDayOffValue.Holiday:
				return true;
			default:
				return false;
		}
	}
}

export class IsDayOff {
	private static readonly MAX_INTERVAL_DAYS = 366;
	private static readonly MS_PER_DAY = 1000 * 60 * 60 * 24;

	#url: string;

	constructor(url: string) {
		this.#url = url;
	}

	/**
	 * Sets the API base URL
	 * @param url - The base URL for the API
	 * @returns this instance for method chaining
	 * @example
	 * ```typescript
	 * const api = new IsDayOff('https://isdayoff.ru');
	 * api.setUrl('https://custom.api.com').today();
	 * ```
	 */
	public setUrl(url: string): this {
		this.#url = url;
		return this;
	}

	/**
	 * Gets the current API base URL
	 * @returns The current base URL
	 */
	public get url(): Readonly<string> {
		return this.#url;
	}

	/**
	 * Gets the day-off status for today
	 * @param options - API options to customize the query
	 * @returns Promise resolving to IsDayOffDay instance representing today's status
	 * @throws {Error} When API returns error codes (100, 101, 199)
	 * @example
	 * ```typescript
	 * const today = await isDayOff.today();
	 * console.log(today.bool()); // true if day off, false otherwise
	 * ```
	 */
	public async today(
		options: IsDayOffApiOptions = {},
	): Promise<Readonly<IsDayOffDay>> {
		return this.formatSingleResponse(
			await this.callApi({
				type: IsDayOffCallType.Today,
				...options,
			}),
		);
	}

	/**
	 * Gets the day-off status for tomorrow
	 * @param options - API options to customize the query
	 * @returns Promise resolving to IsDayOffDay instance representing tomorrow's status
	 * @throws {Error} When API returns error codes (100, 101, 199)
	 * @example
	 * ```typescript
	 * const tomorrow = await isDayOff.tomorrow();
	 * console.log(tomorrow.bool()); // true if day off, false otherwise
	 * ```
	 */
	public async tomorrow(
		options: IsDayOffApiOptions = {},
	): Promise<Readonly<IsDayOffDay>> {
		return this.formatSingleResponse(
			await this.callApi({
				type: IsDayOffCallType.Tomorrow,
				...options,
			}),
		);
	}

	/**
	 * Gets IsDayOff value for a single day
	 * @param date - date @default today
	 * @param options - @see IsDayOffApiOptions
	 * @returns IsDayOffDay instance representing the day status
	 * @throws {Error} When date is invalid or API returns an error
	 * @example
	 * ```typescript
	 * const day = await isDayOff.day(new Date('2026-01-01'));
	 * console.log(day.bool()); // true if day off, false otherwise
	 * ```
	 */
	public async day(
		date = new Date(),
		options?: IsDayOffApiOptions,
	): Promise<Readonly<IsDayOffDay>> {
		this.validateDate(date);
		return this.formatSingleResponse(
			await this.callApi({
				type: IsDayOffCallType.Day,
				year: this.formatYear(date),
				month: this.formatMonth(date),
				day: this.formatDay(date),
				...options,
			}),
		);
	}

	/**
	 * Gets IsDayOff values for a month
	 * @param date - date @default today
	 * @param options - @see IsDayOffApiOptions
	 * @returns Array of IsDayOffDay instances for each day in the month
	 * @throws {Error} When date is invalid or API returns an error
	 * @example
	 * ```typescript
	 * const days = await isDayOff.month(new Date('2026-01-01'));
	 * days.forEach((day, index) => console.log(`Day ${index + 1}: ${day.bool()}`));
	 * ```
	 */
	public async month(
		date = new Date(),
		options?: IsDayOffApiOptions,
	): Promise<ReadonlyArray<Readonly<IsDayOffDay>>> {
		this.validateDate(date);
		return this.formatIntervalResponse(
			await this.callApi({
				type: IsDayOffCallType.Month,
				year: this.formatYear(date),
				month: this.formatMonth(date),
				...options,
			}),
		);
	}

	/**
	 * Gets IsDayOff values for a year
	 * @param date - date @default today
	 * @param options - @see IsDayOffApiOptions
	 * @returns Array of IsDayOffDay instances for each day in the year
	 * @throws {Error} When date is invalid or API returns an error
	 * @example
	 * ```typescript
	 * const days = await isDayOff.year(new Date('2026-01-01'));
	 * console.log(`Total days in year: ${days.length}`);
	 * ```
	 */
	public async year(
		date = new Date(),
		options?: IsDayOffApiOptions,
	): Promise<ReadonlyArray<Readonly<IsDayOffDay>>> {
		this.validateDate(date);
		return this.formatIntervalResponse(
			await this.callApi({
				type: IsDayOffCallType.Year,
				year: this.formatYear(date),
				...options,
			}),
		);
	}

	/**
	 * Gets IsDayOff values for an interval
	 * @param start - Interval start date
	 * @param start - Interval end date
	 * @param options - @see IsDayOffApiOptions
	 * @returns IsDayOff[] @see IsDayOffDay - results for each day of specified interval;
	 */
	public async interval(
		start: Date,
		end: Date,
		options?: IsDayOffApiOptions,
	): Promise<ReadonlyArray<Readonly<IsDayOffDay>>> {
		this.validateDate(start);
		this.validateDate(end);

		/** Validate interval direction */
		if (start > end) {
			throw new Error(
				"Interval error: start date must be before or equal to end date",
			);
		}

		/** Validate interval length */
		const daysDifference =
			Math.abs(start.getTime() - end.getTime()) / IsDayOff.MS_PER_DAY;
		if (daysDifference > IsDayOff.MAX_INTERVAL_DAYS) {
			throw new Error(
				`Interval error: interval longer than ${IsDayOff.MAX_INTERVAL_DAYS} days`,
			);
		}

		const response = await this.callApi({
			type: IsDayOffCallType.Interval,
			date1: this.formatFullDate(start),
			date2: this.formatFullDate(end),
			...options,
		});

		return this.formatIntervalResponse(response);
	}

	/**
	 * Checks if the year is a leap year
	 * @param date - date @default current
	 * @returns boolean - true if leap year, false otherwise
	 * @throws {Error} When date is invalid or API returns an error
	 * @example
	 * ```typescript
	 * const isLeap = await isDayOff.isLeapYear(new Date('2024-01-01'));
	 * console.log(isLeap); // true
	 * ```
	 */
	public async isLeapYear(date: Date = new Date()): Promise<boolean> {
		this.validateDate(date);
		const response = await this.callApi({
			type: IsDayOffCallType.LeapYear,
			year: this.formatYear(date),
		});
		return this.formatIsLeapYearResponse(response);
	}

	/** Main api calling function */
	private async callApi(
		options: Readonly<CallApiOptions>,
	): Promise<Readonly<string>> {
		const response = await fetch(
			`${this.#url}/${this.prepareEndpoint(options)}?${this.prepareQuery(options)}`,
		).then((res) => res.text());

		/** Handle response with error codes */
		switch (response) {
			case "100":
				throw new Error("[100]: Invalid date");
			case "101":
				throw new Error("[101]: Data not found");
			case "199":
				throw new Error("[199]: Service error");
			default:
				if (!/^[01248]+$/.test(response)) {
					throw new Error(`Unexpected response: [${response}]`);
				}
				return response;
		}
	}

	/**
	 * Validates that a Date object is valid
	 * @param date - Date to validate
	 * @throws {Error} When date is invalid
	 */
	private validateDate(date: Date): void {
		if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
			throw new Error("Invalid date provided");
		}
	}

	/**
	 * Type guard to check if a number is a valid IsDayOffValue enum
	 * @param value - Number to check
	 * @returns true if value is a valid IsDayOffValue
	 */
	private isValidDayOffValue(value: number): value is IsDayOffValue {
		return [
			IsDayOffValue.BusinessDay,
			IsDayOffValue.DayOff,
			IsDayOffValue.ShortDay,
			IsDayOffValue.CovidBusinessDay,
			IsDayOffValue.Holiday,
		].includes(value);
	}

	/** Parse returned value */
	private parseValue(value: string): IsDayOffDay {
		const parsed = Number.parseInt(value, 10);
		if (!this.isValidDayOffValue(parsed)) {
			throw new Error(`Unexpected value: [${value}]`);
		}
		return new IsDayOffDay(parsed);
	}

	/** Formats year to YYYY */
	private formatYear(date: Date): string {
		return String(date.getFullYear()).padStart(4, "0");
	}

	/** Formats month to MM */
	private formatMonth(date: Date): string {
		return String(date.getMonth() + 1).padStart(2, "0");
	}

	/** Formats day to DD */
	private formatDay(date: Date): string {
		return String(date.getDate()).padStart(2, "0");
	}

	/** Formats date to YYYYMMDD */
	private formatFullDate(date: Date): string {
		return `${this.formatYear(date)}${this.formatMonth(date)}${this.formatDay(date)}`;
	}

	private formatSingleResponse(response: string): IsDayOffDay {
		return this.parseValue(response);
	}

	/** Formats interval response to IsDayOff[] */
	private formatIntervalResponse(
		response: string,
	): ReadonlyArray<Readonly<IsDayOffDay>> {
		return response.split("").map((item) => this.parseValue(item));
	}

	/** Formats isLeapYear response */
	private formatIsLeapYearResponse(response: string): boolean {
		return Boolean(Number(response));
	}

	/** Prepares endpoint */
	private prepareEndpoint(options: CallApiOptions): string {
		switch (options.type) {
			case IsDayOffCallType.Today:
			case IsDayOffCallType.Tomorrow:
				return options.type;
			case IsDayOffCallType.LeapYear:
				return "api/isleap";
			default:
				return "api/getdata";
		}
	}

	private prepareQuery({ type, ...options }: CallApiOptions): string {
		const params = new URLSearchParams();

		for (const [key, value] of Object.entries(options)) {
			if (value !== undefined && value !== false) {
				params.append(key, typeof value === "boolean" ? "1" : String(value));
			}
		}

		return params.toString();
	}
}
