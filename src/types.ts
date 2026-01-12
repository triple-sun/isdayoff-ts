export type ApiOptions = {
  /** Country code (default: RU) */
  cc?: string;
  /** use 2 for short days @default false */
  pre?: boolean;
  /** use 5 for covid-era workdays @default false */
  covid?: boolean;
};

export type ApiParams = {
  day?: string;
  month?: string;
  year?: string;
  date1?: string;
  date2?: string;
} & ApiOptions;
