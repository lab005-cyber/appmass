@echo off
echo Running appmass tests...
echo.
echo [1/3] Unit Tests
npx jest --testPathPattern=tests/unit --coverage
echo.
echo [2/3] Integration Tests
npx jest --testPathPattern=tests/integration
echo.
echo [3/3] E2E Tests
npx detox test --configuration android.ci
echo.
echo All tests completed.
