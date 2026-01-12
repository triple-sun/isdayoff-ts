import { ApiParams } from "./types";
import axios, { AxiosInstance, isAxiosError } from "axios";
import { ApiOptions } from "./types";

export class IsDayOffAPI {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: "https://isdayoff.ru",
      responseType: "text",
    });
  }

  /**
   *
   * @param date - date @default today
   * @param options - @see ApiOptions
   * @returns true - day off, false - business day
   */
  public async date(date = new Date(), options?: ApiOptions): Promise<boolean> {
    return this.formatSingleResponse(
      await this.callApi({
        year: this.formatYear(date),
        month: this.formatMonth(date),
        day: this.formatDay(date),
        ...options,
      })
    );
  }

  /**
   *
   * @param date - date @default today
   * @param options - @see ApiOptions
   * @returns boolean[] - results for each day of month of specified date; true - day off, false - business day
   */
  public async month(date = new Date(), options?: ApiOptions) {
    return this.formatIntervalResponse(
      await this.callApi({
        year: this.formatYear(date),
        month: this.formatMonth(date),
        ...options,
      })
    );
  }

  /**
   *
   * @param date - date @default today
   * @param options - @see ApiOptions
   * @returns boolean[] - results for each day in the year of specified date; true - day off, false - business day
   */
  public async year(date = new Date(), options?: ApiOptions) {
    return this.formatIntervalResponse(
      await this.callApi({
        year: this.formatYear(date),
        ...options,
      })
    );
  }

  /**
   *
   * @param start - Interval start date
   * @param start - Interval end date
   * @param options - @see ApiOptions
   * @returns boolean[] - results for each day of specified interval; true - day off, false - business day
   */
  public async interval(
    start: Date,
    end: Date,
    options?: ApiOptions
  ): Promise<boolean[]> {
    /** interval validation */
    if (
      Math.abs(start.getTime() - end.getTime()) / (1000 * 60 * 60 * 24) >
      366
    ) {
      throw new Error("Interval error: interval longer than 366 days");
    }

    const response = await this.callApi({
      date1: this.formatFullDate(start),
      date2: this.formatFullDate(end),
      ...options,
    });

    return this.formatIntervalResponse(response);
  }

  /** Main api calling function */
  private async callApi(params: ApiParams): Promise<string> {
    try {
      const response = this.parseResponse(
        (await this.api.get<string>("/api/getdata", { params })).data
      );

      if (response instanceof Error) {
        throw response;
      }

      return response;
    } catch (err: any) {
      if (isAxiosError(err) && err.response?.data) {
        throw new Error(
          `[${err.code}]: ${err.message}: ${this.parseResponse(err.response?.data)}`
        );
      }

      throw new Error(`Unknown error: ${err}`);
    }
  }

  /** Formats year to YYYY */
  private readonly formatYear = (date: Date): string =>
    `0000${date.getFullYear()}`.slice(-4);
  /** Fortmats month to MM */
  private readonly formatMonth = (date: Date): string =>
    `00${date.getMonth() + 1}`.slice(-2);
  /** Formats day to DD */
  private readonly formatDay = (date: Date): string =>
    `00${date.getDate()}`.slice(-2);
  /** Formats date to YYYYMMDD */
  private readonly formatFullDate = (date: Date): string =>
    `${this.formatYear(date)}${this.formatMonth(date)}${this.formatDay(date)}`;
  private readonly formatSingleResponse = (response: string): boolean =>
    Boolean(parseInt(response));
  /** Formats interval response to boolean[] */
  private readonly formatIntervalResponse = (response: string): boolean[] =>
    response.split("").map((item) => Boolean(parseInt(item)));
  /** Handles response with error codes */
  private readonly parseResponse = (response: string): Error | string => {
    switch (response) {
      case "100":
        return new Error("[100]: Invalid date");
      case "101":
        return new Error("[101]: Data not found");
      case "199":
        return new Error("[199]: Service error");
      default:
        switch (true) {
          case !/[0124]+/.test(response):
          case isNaN(parseInt(response)):
            return new Error(`Unexpected response: [${response}]`);
          default:
            return response;
        }
    }
  };
}
