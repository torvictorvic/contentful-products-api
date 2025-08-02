module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: 'src',
  testRegex: '.*\\.spec\\.ts$',
  transform: { '^.+\\.(t|j)s$': 'ts-jest' },
  collectCoverageFrom: [
    '**/*.service.ts',
    '**/*.controller.ts',
    '!**/node_modules/**',
    '!**/main.ts'
  ],
  coverageDirectory: '../coverage',
  testEnvironment: 'node',
};
