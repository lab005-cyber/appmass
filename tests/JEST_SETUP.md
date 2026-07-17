# Jest Configuration Guide

## Setup

```json
// jest.config.js
module.exports = {
  preset: "jest-expo",
  transformIgnorePatterns: [
    "node_modules/(?!(expo|@expo|expo-modules-core|react-native|react-native-.*|@react-native.*|@react-navigation.*|@appwrite|react-native-appwrite)/)"
  ],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "^@components/(.*)$": "<rootDir>/src/components/$1",
    "^@screens/(.*)$": "<rootDir>/src/screens/$1",
    "^@services/(.*)$": "<rootDir>/src/services/$1",
    "^@store/(.*)$": "<rootDir>/src/store/$1"
  },
  setupFilesAfterSetup: ["./tests/jest.setup.ts"],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json"],
  collectCoverageFrom: [
    "src/**/*.{ts,tsx}",
    "!src/**/*.d.ts",
    "!src/**/index.ts",
    "!src/navigation/**",
    "!src/types/**"
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  }
};
```

## Setup File

```typescript
// tests/jest.setup.ts
import "@testing-library/jest-native/extend-expect";

// Mock Appwrite
jest.mock("react-native-appwrite", () => ({
  Client: jest.fn().mockImplementation(() => ({
    setEndpoint: jest.fn().mockReturnThis(),
    setProject: jest.fn().mockReturnThis(),
    setPlatform: jest.fn().mockReturnThis()
  })),
  Account: jest.fn(),
  Databases: jest.fn(),
  Storage: jest.fn()
}));

// Mock expo modules
jest.mock("expo-image", () => ({
  Image: "Image"
}));
```

## Running Tests

```bash
# All tests
npx jest

# Unit tests
npx jest --testPathPattern=tests/unit

# Integration tests
npx jest --testPathPattern=tests/integration

# With coverage
npx jest --coverage

# Watch mode
npx jest --watch
```
