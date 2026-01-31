import type { Config } from "jest";

const config: Config = {
	preset: "ts-jest",
	testEnvironment: "node",
	testMatch: ["**/*.spec.ts"],
	verbose: true,
	collectCoverage: true,
	coverageDirectory: "coverage",
	collectCoverageFrom: ["src/**/*.ts"],
	coverageThreshold: {
		global: {
			lines: 90,
			statements: 90,
			branches: 85,
			functions: 100,
		},
	},
};

export default config;
