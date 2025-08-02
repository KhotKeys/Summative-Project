export default {
  testEnvironment: "node",
  setupFilesAfterEnv: ["<rootDir>/tests/index.js"],
  transform: {
    "^.+\\.js$": "babel-jest",
  },
  transformIgnorePatterns: ["<rootDir>/node_modules/"],
  collectCoverageFrom: [
    "services/**/*.js",
    "controllers/**/*.js",
    "utils/**/*.js",
    "!**/node_modules/**",
  ],
  testMatch: ["**/tests/**/*.test.js"],
};
