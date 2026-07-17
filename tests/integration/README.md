# Integration Tests

## Framework
- **Jest** + **React Native Testing Library**
- **MSW (Mock Service Worker)** for API mocking
- Tests run on Node (not device/emulator)

## Test Areas

### Screen-Level Tests
- Render full screens with mocked providers
- Verify all UI elements render correctly
- Test navigation flows between screens
- Test loading, empty, error states

### API Integration Tests
- Mock Appwrite REST API with MSW handlers
- Test end-to-end request/response cycles
- Verify correct data flows from API → store → UI
- Test pagination, sorting, filtering

### Auth Flow Tests
- Signup flow: form → validation → API → store → navigation
- Login flow: credentials → session → redirect
- Password reset flow
- Session expiry → redirect to login
- Biometric auth toggle

## MSW Handlers Example

```typescript
// tests/mocks/handlers.ts
import { http, HttpResponse } from "msw";

export const handlers = [
  // Auth
  http.post("*/v1/account/sessions/email", ({ request }) => {
    return HttpResponse.json({
      $id: "session_123",
      userId: "user_123",
      expire: "2025-01-01T00:00:00.000+00:00"
    });
  }),

  // Posts list
  http.get("*/v1/databases/main/collections/posts/documents", () => {
    return HttpResponse.json({
      documents: mockPosts,
      total: mockPosts.length
    });
  })
];
```

## Running

```bash
npx jest --testPathPattern=tests/integration
```
