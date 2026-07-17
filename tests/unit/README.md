# Unit Tests

## Framework
- **Jest** + **React Native Testing Library**
- Test runner: Jest (via `npx jest`)
- Assertions: Jest built-in + `@testing-library/jest-native`

## Test Categories

### Utilities (`src/utils/`)
- Pure function tests (formatDate, validateEmail, etc.)
- No mocking needed — test input → output

### Hooks (`src/hooks/`)
- Test with `renderHook` from RNTL
- Mock Appwrite SDK for hooks like `usePosts`, `useUser`
- Verify state transitions and error handling

### Redux Slices (`src/store/`)
- Test reducers and actions in isolation
- Test thunks with mocked Appwrite API
- Use `configureStore` with initial state for slice tests

### Services (`src/services/`)
- Mock Appwrite SDK responses
- Test all CRUD operations
- Test error handling (network failure, auth failure)

## Mocking Appwrite

```typescript
// tests/__mocks__/appwrite.ts
export const account = {
  create: jest.fn(),
  get: jest.fn(),
  updatePrefs: jest.fn(),
  deleteSession: jest.fn()
};

export const databases = {
  createDocument: jest.fn(),
  listDocuments: jest.fn(),
  getDocument: jest.fn(),
  updateDocument: jest.fn(),
  deleteDocument: jest.fn()
};

export const storage = {
  createFile: jest.fn(),
  getFileView: jest.fn(),
  deleteFile: jest.fn()
};
```

## Coverage Targets
- **80%+** overall coverage
- **90%+** for Redux slices and utilities
- **75%+** for hooks and services
- Critical paths (auth, payments) require 100%

## Running

```bash
npx jest --testPathPattern=tests/unit --coverage
```
