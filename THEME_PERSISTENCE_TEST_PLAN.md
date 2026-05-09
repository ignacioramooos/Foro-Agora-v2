# Theme Persistence Test Plan

## Test Objective
Verify that the theme preference (light/dark) persists across:
1. Page refresh
2. Browser restart (simulated by clearing session)
3. Logout/Login cycle
4. Multiple toggle cycles

## Test Environment
- App: Foro-Agora (React + Vite)
- Theme Toggle: Located in Navbar (Sun/Moon icon)
- Theme Storage: LocalStorage + Supabase user_preferences
- Browser: Chrome/Firefox with DevTools

## Pre-requisites
- Development server running: `npm run dev`
- Test account with login credentials
- Browser with DevTools (F12)

## Test Steps

### Phase 1: Initial Setup
1. Start development server
2. Log in with test account
3. Note current theme (Light or Dark)

### Phase 2: Theme Toggle & Immediate Verification
4. Locate theme toggle (Sun/Moon icon in navbar)
5. Click to toggle theme
6. Verify UI changes immediately (background, text colors)
7. Record new theme

### Phase 3: LocalStorage Verification
8. Open DevTools (F12)
9. Navigate to Application → Local Storage
10. Verify "theme" key exists with correct value
11. Take screenshot

### Phase 4: Page Refresh Persistence
12. Refresh page (F5 or Cmd+R)
13. Verify theme is still as toggled (not reverted)
14. Check Network tab for any failed requests
15. Check Console for errors

### Phase 5: Network Request Verification
16. Open Network tab in DevTools (before toggling again)
17. Toggle theme again
18. Observe requests to user_preferences endpoint
19. Verify requests are successful (not 401/403)
20. Check response body

### Phase 6: Logout/Login Persistence
21. Click Logout button (Salir)
22. Verify redirected to login page
23. Log in with same credentials
24. Navigate back to same page/dashboard
25. Verify theme persists

### Phase 7: Multiple Toggle Cycles
26. Toggle theme 2-3 more times
27. Verify each toggle works immediately
28. Refresh after each toggle
29. Verify persistence

### Phase 8: Console & Error Checking
30. Throughout all steps, monitor console for:
    - No red errors
    - No failed network requests
    - No warnings about persistence

## Success Criteria

| Criterion | Expected | Result |
|-----------|----------|--------|
| Theme toggles immediately | UI changes instantly | PASS/FAIL |
| Theme in LocalStorage | "theme" key exists with value | PASS/FAIL |
| Persists after refresh | Theme unchanged after F5 | PASS/FAIL |
| Network requests succeed | No 401/403 errors | PASS/FAIL |
| Persists after logout/login | Theme unchanged after relogin | PASS/FAIL |
| Multiple toggles work | Each toggle succeeds | PASS/FAIL |
| No console errors | Console tab clean | PASS/FAIL |
| No failed requests | Network tab shows success | PASS/FAIL |

## Overall Result
- **Status**: _______________
- **Starting Theme**: _______________
- **Final Theme**: _______________
- **Issues Found**: _______________
- **Notes**: _______________

## Test Automation Notes
- This test requires manual UI interaction and browser DevTools
- Automation would require Playwright/Puppeteer with DevTools integration
- Visual verification of theme changes is manual (UI colors)
