module.exports = {
    preset: "ts-jest",
    testEnvironment: "node",
    verbose: true,
    collectCoverage: true,
    coverageDirectory: "<rootDir>/coverage",
    coverageReporters: ["text", "text-summary", "html"]
};
