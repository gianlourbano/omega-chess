import nextJest from 'next/jest.js'
 
const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
})
 
// Add any custom config to be passed to Jest
/** @type {import('jest').Config} */
const config = {
  // Add more setup options before each test is run
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    "^@/db/(.*)$": "<rootDir>/src/db/$1",
    "^@/db/models/(.*)$": "<rootDir>/src/db/models/$1",
  },

  reporters: ['default',  ['jest-sonar', {
    outputDirectory: '../../jest',
    outputName: 'lastReport.xml',
    reportedFilePath: 'absolute'
  }]],

}
 
// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
export default createJestConfig(config)