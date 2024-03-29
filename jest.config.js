module.exports = {
  roots: ["<rootDir>/src"],
  testMatch: ["**/__tests__/**/*.+(ts|js)", "**/?(*.)+(spec|test).+(ts|js)"],
  transform: {
    "^.+\\.(ts)$": "ts-jest",
  },
  coverageDirectory: "coverage",
  collectCoverageFrom: ["src/**/*.{ts,tsx,js,jsx}", "!src/**/*.d.ts"],
  testEnvironment: "jsdom",
};
