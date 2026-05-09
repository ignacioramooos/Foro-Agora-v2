# Theme Persistence Testing - Execution Guide

## Quick Start

```bash
# 1. Install dependencies (if needed)
npm install

# 2. Run the theme persistence unit tests
npm test -- src/test/theme-persistence.test.ts

# 3. Start dev server for manual testing
npm run dev

# 4. Navigate to http://localhost:5173 and follow manual test steps
```

## Automated Tests

Run all theme persistence tests:
```bash
npm test -- src/test/theme-persistence.test.ts
```

Expected output:
```
✓ Theme Persistence
  ✓ LocalStorage persistence
    ✓ should store theme in localStorage when theme changes
    ✓ should retrieve theme from localStorage on page load
    ✓ should default to light theme if nothing stored
    ✓ should update localStorage when theme toggles
  ✓ DOM class manipulation
    ✓ should add dark class to document when theme is dark
    ✓ should remove dark class when theme is light
    ✓ should toggle dark class correctly
  ✓ Theme persistence workflow
    ✓ should persist theme through simulated page refresh
    ✓ should handle multiple theme toggles with persistence
  ✓ Theme with user session
    ✓ should preserve theme when simulating logout/login
    ✓ should not clear theme on logout
  ✓ Initial theme detection
    ✓ should correctly initialize theme from localStorage
    ✓ should default to light theme when localStorage is empty
    ✓ should handle invalid theme values in localStorage

PASS  src/test/theme-persistence.test.ts
  16 passed
```

## Manual Testing Steps

### Phase 1: Setup
1. Start dev server: `npm run dev`
2. Open http://localhost:5173 in browser
3. Log in with test credentials
4. Open DevTools (F12)

### Phase 2: Initial State Check
1. Check current theme (look at UI - background/text colors)
2. Open DevTools → Application → Local Storage
3. Verify `theme` key exists
4. Note the value: `light` or `dark`

**Expected**: Theme defaults to `light` and is stored in localStorage

### Phase 3: Toggle Theme
1. Locate Sun/Moon icon in navbar (top right)
2. Click the icon to toggle
3. Observe UI changes immediately:
   - Background color changes
   - Text color changes  
   - Icon changes to opposite (Sun ↔ Moon)

**Expected**: Immediate visual feedback, no delay

### Phase 4: Check Network Tab
1. In DevTools, click Network tab
2. Toggle theme again
3. Look for request to `user_preferences`
4. Verify request status: `200 OK` or `204 No Content`

**Expected**: Successful request to update database

### Phase 5: Page Refresh Test
1. Press F5 (or Cmd+R on Mac)
2. Wait for page to reload
3. Check theme after reload

**Expected**: Theme is still as you set it (not reverted)

### Phase 6: Logout/Login Test
1. Click "Salir" (Logout) button
2. Verify redirected to login page
3. Log in again with same credentials
4. Navigate to dashboard or main area

**Expected**: Theme persists from before logout

### Phase 7: Console Check
1. Throughout all steps, check Console tab
2. Look for any red error messages

**Expected**: No console errors

## Success Criteria Checklist

- [ ] Theme toggles immediately (UI changes instantly)
- [ ] Theme stored in localStorage
- [ ] Theme persists after page refresh (F5)
- [ ] Database requests are successful (Network tab)
- [ ] Theme persists after logout/login
- [ ] No console errors
- [ ] No failed network requests
- [ ] Multiple toggles work correctly

## Troubleshooting

### Issue: Theme not persisting after refresh
- **Solution**: Check if localStorage is enabled in browser
- **Check**: DevTools → Application → Storage → Cookies → Allow local storage

### Issue: Database requests failing (401 errors)
- **Solution**: Verify you're logged in
- **Check**: Session token in cookies/auth context
- **Action**: Log out and log back in

### Issue: Console shows errors about useUserPreferences
- **Cause**: user_preferences table might not exist
- **Solution**: Run migration: `npm run migrate`
- **Check**: Supabase dashboard → SQL Editor → Check table exists

### Issue: Theme reverts to light after logout
- **Cause**: Theme not being loaded from database
- **Solution**: Check RLS policies on user_preferences table
- **Action**: Verify policies allow reading/writing own preferences

## Database Migration

If user_preferences table doesn't exist, run:

```bash
# Apply migrations
supabase migration up

# Or manually in Supabase console:
# 1. Go to Supabase dashboard
# 2. SQL Editor
# 3. Run: src/integrations/supabase/migrations/20260507120000_user_preferences.sql
```

## Files Involved

| File | Purpose |
|------|---------|
| `src/contexts/ThemeContext.tsx` | Theme provider & state management |
| `src/hooks/useUserPreferences.ts` | Database sync for theme |
| `src/components/Navbar.tsx` | Theme toggle button |
| `src/test/theme-persistence.test.ts` | Unit tests |
| `supabase/migrations/20260507120000_user_preferences.sql` | Database table |
| `src/integrations/supabase/types.ts` | TypeScript types |

## Expected Behavior

### First Time User (No localStorage)
1. App loads with theme = "light"
2. Database fetches user_preferences → theme: "light"
3. localStorage set to "light"
4. UI initialized with light theme

### Returning User (With localStorage)
1. App loads, reads localStorage → theme: "dark"
2. DOM updated to dark immediately
3. Database fetch in background
4. If database has different theme, update to match

### Toggle Theme
1. Click toggle button
2. localStorage updated immediately
3. DOM updated immediately (UI changes)
4. Database updated asynchronously
5. Error handling if DB fails (keeps localStorage)

### Page Refresh
1. Clear DOM classes
2. Read localStorage
3. Restore theme from localStorage
4. Database syncs if user logged in
5. Theme persists correctly

### Logout → Login
1. LocalStorage persists (not cleared)
2. Session cleared
3. New login
4. Database fetches user_preferences
5. Theme restored from database
6. UI updates

## Performance Notes

- LocalStorage reads: ~1ms (instant)
- localStorage writes: ~1ms (instant)
- Database writes: async, 100-500ms
- Database reads: async, 100-500ms
- DOM updates: ~16ms (1 frame)

**Result**: Theme toggle appears instant to user, database syncs in background

## Additional Testing

### Keyboard Shortcut (Alt Method)
1. Press "M" key (without typing in input field)
2. Theme should toggle
3. Useful for quick testing

### Cross-Device Testing
1. Set theme on Device A
2. Refresh on Device A
3. Check theme on Device B in incognito (if database synced)
4. Log out and log in on Device B
5. Theme should sync from database

### Performance Testing
1. Toggle theme rapidly (10+ times)
2. Verify no memory leaks
3. Check Network tab for excessive requests
4. Verify UI stays responsive

## Sign-Off

- **Test Date**: _____
- **Tester**: _____
- **Result**: ✅ PASS / ❌ FAIL
- **Notes**: _____

---

For detailed analysis, see: `THEME_PERSISTENCE_TEST_REPORT.md`
