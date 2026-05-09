# Quick Testing Guide - Profile Persistence

## Setup
```bash
npm run dev
# Then navigate to http://localhost:5173
```

## Test Credentials
Use your test account credentials (ask team for provided test account)

## Test Flows (Can be done in 5-10 minutes total)

### ✅ Test 1: Save & Display Success Toast
1. Log in → Dashboard → Configuración (Settings tab)
2. Click "Editar" next to Nombre
3. Change name to: `TestUser_$(date +%s)` (or use current timestamp)
4. Click "Guardar"
5. **Verify**: 
   - ✅ Green toast appears saying "Nombre actualizado"
   - ✅ Display name updates immediately
   - ✅ No red error toasts

### ✅ Test 2: Refresh Persistence
6. Press F5 (refresh page)
7. **Verify**:
   - ✅ Page reloads completely
   - ✅ Display name still shows your test name
   - ✅ Name didn't revert to old value

### ✅ Test 3: Edit Mode Shows Fresh Data
8. Click "Editar" again
9. **Verify**:
   - ✅ Input field shows your test name (not stale old value)
   - ✅ Field is editable and focused
10. Click "Cancelar"

### ✅ Test 4: Multiple Edit Cycles
11. Click "Editar" again
12. Change name to: `TestUser_Round2_$(date +%s)`
13. Click "Guardar"
14. **Verify**:
    - ✅ Success toast appears
    - ✅ Display updates
15. Press F5 to refresh
16. **Verify**:
    - ✅ New name persists

### ✅ Test 5: Logout/Login Persistence
17. Click "Cerrar sesión"
18. **Verify**:
    - ✅ Redirected to login page
    - ✅ Session cleared
19. Log in with same credentials
20. Navigate back to Settings
21. **Verify**:
    - ✅ Display name still shows your Round2 test name
    - ✅ Name persisted through logout/login

### ✅ Test 6: No Console Errors
Throughout all tests:
22. Open DevTools (F12)
23. Go to Console tab
24. **Verify**:
    - ✅ No red error messages
    - ✅ No warnings about state/props

## Quick Pass/Fail

| Scenario | Expected | Pass | Fail |
|----------|----------|------|------|
| Save shows toast | "Nombre actualizado" | ✅ | ❌ |
| Display updates immediately | Name shows new value | ✅ | ❌ |
| Refresh persists | Name unchanged after F5 | ✅ | ❌ |
| Edit shows fresh data | Input shows current value | ✅ | ❌ |
| Logout/Login persists | Name after relogin | ✅ | ❌ |
| No console errors | Console tab clean | ✅ | ❌ |

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Can't log in | Check test credentials, verify Supabase connection |
| Toast doesn't appear | Check browser notification settings |
| Name reverts on refresh | Clear browser cache, hard refresh (Ctrl+Shift+R) |
| Stale value in input | Page reload should fix, check useEffect working |
| Console errors | Check network tab for 401/403, verify RLS policies |

## Success Criteria - MUST ALL PASS

- [x] ✅ Display name persists after page refresh
- [x] ✅ Display name persists after logout/login cycle  
- [x] ✅ Success toast appears on save
- [x] ✅ No console errors during operation
- [x] ✅ Edit mode shows fresh data (not stale)
- [x] ✅ Multiple edit cycles work

## Final Result

**Overall Status**: _______________

**Tester Name**: _______________

**Date**: _______________

**Notes**: _______________
