"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts_jest_1 = require("ts-jest");
const defaultEsmPreset = (0, ts_jest_1.createDefaultEsmPreset)();
const jestConfig = {
    // [...]
    ...defaultEsmPreset,
    moduleNameMapper: {
        '^(\\.{1,2}/.*)\\.js$': '$1',
    },
};
exports.default = jestConfig;
//# sourceMappingURL=jest.config.js.map