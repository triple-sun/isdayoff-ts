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
	#url: string;

	constructor(url: string) {
		this.#url = url;
	}

	public setUrl(url: string): this {
		this.#url = url;
		return this;
	}

	public get url(): Readonly<string> {
		return this.#url;
	}

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
	 * @returns true - day off, false - business day
	 */
	public async day(
		date = new Date(),
		options?: IsDayOffApiOptions,
	): Promise<Readonly<IsDayOffDay>> {
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
	 * @returns IsDayOff[] @see IsDayOffDay - results for each day of month of specified date; true - day off, false - business day
	 */
	public async month(
		date = new Date(),
		options?: IsDayOffApiOptions,
	): Promise<ReadonlyArray<Readonly<IsDayOffDay>>> {
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
	 * @returns IsDayOff[] @see IsDayOffDay - results for each day in the year of specified date; true - day off, false - business day
	 */
	public async year(
		date = new Date(),
		options?: IsDayOffApiOptions,
	): Promise<ReadonlyArray<Readonly<IsDayOffDay>>> {
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
		/** interval validation */
		if (
			Math.abs(start.getTime() - end.getTime()) / (1000 * 60 * 60 * 24) >
			366
		) {
			throw new Error("Interval error: interval longer than 366 days");
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
   * @returns boolean
 @see IsDayOffDay   */
	public async isLeapYear(date: Date = new Date()): Promise<boolean> {
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
				switch (true) {
					case !/[01248]+/.test(response):
						throw new Error(`Unexpected response: [${response}]`);
					default:
						return response;
				}
		}
	}
	/** Parse returned value */
	private readonly parseValue = (value: string): Readonly<IsDayOffDay> => {
		const parsed = parseInt(value, 10);
		switch (true) {
			case !Object.values(IsDayOffValue).includes(parsed):
				throw new Error(`Unexpected value: [${value}]`);
			default:
				return new IsDayOffDay(parsed);
		}
	};
	/** Formats year to YYYY */
	private readonly formatYear = (date: Date): Readonly<string> =>
		`0000${date.getFullYear()}`.slice(-4);
	/** Fortmats month to MM */
	private readonly formatMonth = (date: Date): Readonly<string> =>
		`00${date.getMonth() + 1}`.slice(-2);
	/** Formats day to DD */
	private readonly formatDay = (date: Date): Readonly<string> =>
		`00${date.getDate()}`.slice(-2);
	/** Formats date to YYYYMMDD */
	private readonly formatFullDate = (date: Date): Readonly<string> =>
		`${this.formatYear(date)}${this.formatMonth(date)}${this.formatDay(date)}`;
	private readonly formatSingleResponse = (
		response: string,
	): Readonly<IsDayOffDay> => this.parseValue(response);
	/** Formats interval response to IsDayOff[] */
	private readonly formatIntervalResponse = (
		response: Readonly<string>,
	): ReadonlyArray<Readonly<IsDayOffDay>> =>
		response.split("").map((item) => this.parseValue(item));
	/** Formats isLeapYear response */
	private readonly formatIsLeapYearResponse = (
		response: string,
	): Readonly<boolean> => Boolean(this.parseValue(response));

	/** Prepares endpoint */
	private readonly prepareEndpoint = (
		options: CallApiOptions,
	): Readonly<string> => {
		switch (options.type) {
			case IsDayOffCallType.Today:
			case IsDayOffCallType.Tomorrow:
				return options.type;
			case IsDayOffCallType.LeapYear:
				return `api/isleap`;
			default:
				return `api/getdata`;
		}
	};

	private readonly prepareQuery = ({
		type,
		...options
	}: CallApiOptions): Readonly<string> =>
		Object.entries(options)
			.map(([k, v]) => v && `${k}=${typeof v === "boolean" ? +v : v}`)
			.filter(Boolean)
			.join("&");
}
