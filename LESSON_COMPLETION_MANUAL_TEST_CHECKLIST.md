# Lesson Completion Manual Testing Checklist

## Quick Reference

**What to test:** Lesson completion tracking in Learning Roadmap
**How long:** ~15-20 minutes
**Requirements:** Browser DevTools, test account access

---

## STEP-BY-STEP TEST GUIDE

### Initial Setup
- [ ] Open the Foro-Agora app in browser
- [ ] Log in with test account
- [ ] Open DevTools (F12)
- [ ] Go to DevTools → Network tab
- [ ] Navigate to Dashboard → Learning Roadmap
- [ ] Note which lesson shows "Continuar Clase" button (should be in "in_progress" state)

---

## Test Suite 1: Immediate UI Response (2 min)

### Setup
- [ ] Identify the current "in_progress" lesson
- [ ] Keep DevTools Network tab open

### Test Steps
1. [ ] Click the "Continuar Clase X" button
2. [ ] **VERIFY:** Button immediately shows "Marcando..." text
3. [ ] **VERIFY:** Spinner icon appears in button
4. [ ] **VERIFY:** Button is disabled/grayed out
5. [ ] **VERIFY:** Button stays disabled until operation completes

### Expected Results
- Button changes instantly (< 100ms)
- Spinner animates smoothly
- No visual flicker

### ✅ Pass Criteria: All 5 checks passed

---

## Test Suite 2: Success Toast (3 min)

### Setup
- Keep DevTools open
- Look for toast notification area (usually top right)

### Test Steps
1. [ ] Click "Continuar Clase" button (same lesson as Test 1)
2. [ ] **WATCH:** Look for toast notification popup
3. [ ] **VERIFY:** Toast appears within 1 second
4. [ ] **VERIFY:** Toast message says: "¡Clase completada! Excelente trabajo."
5. [ ] **VERIFY:** Toast automatically disappears after 3-5 seconds
6. [ ] **VERIFY:** No error toast appears (red colored)

### Expected Results
- One green success toast
- Correct Spanish message
- Auto-dismiss timing is reasonable

### ✅ Pass Criteria: All 6 checks passed

---

## Test Suite 3: Button State Change (2 min)

### Setup
- Same lesson completion as previous tests
- Don't close toast yet

### Test Steps
1. [ ] After success toast, observe the lesson card
2. [ ] **VERIFY:** Button disappears or changes state
3. [ ] **VERIFY:** Lesson icon changes to checkmark circle
4. [ ] **VERIFY:** Status text changes to "Completado"
5. [ ] **VERIFY:** "Continuar Clase" button is gone

### Expected Results
- UI immediately reflects completion
- Visual consistency (checkmark icon, completed text)
- No "Continuar Clase" button visible anymore

### ✅ Pass Criteria: All 4 checks passed

---

## Test Suite 4: Network Request (3 min)

### Setup
- [ ] Go back to Learning Roadmap (if page changed)
- [ ] Open DevTools → Network tab
- [ ] Clear network log (Ctrl+L or clear button)

### Test Steps
1. [ ] Find another "Continuar Clase" button (next lesson)
2. [ ] Click it to mark next lesson complete
3. [ ] In Network tab, look for requests
4. [ ] **FIND:** POST or PATCH request with "lesson_progress" in URL
5. [ ] **CLICK:** This request to view details
6. [ ] **VERIFY:** Request Headers show POST or PATCH method
7. [ ] **VERIFY:** Request body (Preview tab) contains:
   - `user_id`: a UUID
   - `lesson_id`: the lesson ID
   - `completed_at`: timestamp like "2024-01-15T10:30:45.123Z"
8. [ ] **VERIFY:** Response status is 200 or 201 (green)
9. [ ] **VERIFY:** Response shows the created/updated record

### Expected Results
- Exactly one request to lesson_progress per click
- Correct HTTP method (POST for new, PATCH for update)
- Proper JSON payload
- Successful response

### ✅ Pass Criteria: All 9 checks passed

---

## Test Suite 5: Console Errors (2 min)

### Setup
- [ ] Open DevTools → Console tab
- [ ] Do NOT close previous tabs

### Test Steps
1. [ ] Look at Console output
2. [ ] **VERIFY:** No red error messages
3. [ ] **VERIFY:** No orange warning symbols (⚠️) with actual errors
4. [ ] **VERIFY:** No "Failed to fetch" messages
5. [ ] **VERIFY:** No "undefined" reference errors
6. [ ] **VERIFY:** No 404 or 500 status messages

### Expected Results
- Clean console output
- Maybe some info/debug logs (blue ℹ️)
- No errors or failures

### ✅ Pass Criteria: All 5 checks passed

---

## Test Suite 6: Page Refresh Persistence (3 min)

### Setup
- [ ] You should have 2 lessons marked as complete from previous tests
- [ ] Keep DevTools open

### Test Steps
1. [ ] Press F5 or Ctrl+R to refresh the page
2. [ ] Wait for page to fully load
3. [ ] Look at Learning Roadmap lessons
4. [ ] **VERIFY:** Both previously completed lessons show as "Completado"
5. [ ] **VERIFY:** Both show checkmark icons
6. [ ] **VERIFY:** No "Continuar Clase" button on those lessons
7. [ ] **VERIFY:** Next lesson shows "Continuar Clase" button
8. [ ] In Network tab, **VERIFY:** No error requests after refresh

### Expected Results
- All completion status preserved
- Data loaded from backend (not just cached)
- Lesson progression still correct

### ✅ Pass Criteria: All 8 checks passed

---

## Test Suite 7: Logout/Login Persistence (5 min)

### Setup
- Page is refreshed and stable
- 2+ lessons marked complete

### Test Steps
1. [ ] Click logout (usually in settings or menu)
2. [ ] **VERIFY:** You're redirected to login page
3. [ ] **VERIFY:** All profile data cleared
4. [ ] Log back in with same credentials
5. [ ] **WAIT:** Page loads and fetches profile
6. [ ] Navigate to Learning Roadmap
7. [ ] **VERIFY:** Same 2 lessons still show as "Completado"
8. [ ] **VERIFY:** Checkmark icons present
9. [ ] **VERIFY:** "Continuar Clase" button on next lesson
10. [ ] In DevTools Console, **VERIFY:** No errors related to lesson loading

### Expected Results
- Completion status survives logout/login cycle
- Data persists across sessions
- No authentication or data fetch errors

### ✅ Pass Criteria: All 10 checks passed

---

## Test Suite 8: No Console Errors After Login (2 min)

### Setup
- Fresh logout/login just completed

### Test Steps
1. [ ] Open DevTools → Console
2. [ ] **VERIFY:** No red errors
3. [ ] **VERIFY:** No 404 for lesson_progress requests
4. [ ] **VERIFY:** No auth-related warnings
5. [ ] **VERIFY:** Session is valid (no "user not authenticated" messages)

### Expected Results
- Clean console
- All data loads successfully
- User is properly authenticated

### ✅ Pass Criteria: All 4 checks passed

---

## Test Suite 9: Complete Next Lesson (2 min)

### Setup
- Logged in, at Learning Roadmap
- 2 lessons already complete

### Test Steps
1. [ ] Click "Continuar Clase" on next available lesson
2. [ ] **VERIFY:** Loading state appears
3. [ ] **VERIFY:** Success toast appears
4. [ ] **VERIFY:** Button changes to "Completado"
5. [ ] **VERIFY:** No errors in Network tab
6. [ ] Refresh page (F5)
7. [ ] **VERIFY:** Now 3 lessons show as "Completado"

### Expected Results
- Can complete multiple lessons sequentially
- Each completion persists
- System handles progression correctly

### ✅ Pass Criteria: All 7 checks passed

---

## Test Suite 10: No Duplicate Requests (2 min)

### Setup
- [ ] DevTools Network tab open
- [ ] Clear network log
- [ ] At Learning Roadmap with an "in_progress" lesson

### Test Steps
1. [ ] Rapidly click the "Continuar Clase" button 3-4 times in quick succession
2. [ ] Stop clicking
3. [ ] Wait 2 seconds
4. [ ] In Network tab, count requests to "lesson_progress"
5. [ ] **VERIFY:** Only 1 request to lesson_progress was made
6. [ ] **VERIFY:** Not 3-4 duplicate requests
7. [ ] **VERIFY:** No errors in response

### Expected Results
- Button prevents multiple simultaneous requests
- Only one database write occurs
- No race conditions or duplicates

### ✅ Pass Criteria: All 7 checks passed

---

## Final Verification Checklist

### Data Integrity
- [ ] All completed lessons persist after page refresh
- [ ] All completed lessons persist after logout/login
- [ ] No duplicate completion records in database
- [ ] Completion timestamps are valid and recent

### User Experience
- [ ] Loading state is clear and immediate
- [ ] Success feedback is clear (toast + UI change)
- [ ] No confusing or error states
- [ ] Lesson progression makes logical sense

### Technical Quality
- [ ] Network requests use correct HTTP methods
- [ ] Request payloads are properly formatted
- [ ] Response status codes are successful
- [ ] No console errors or warnings
- [ ] No failed network requests

### Performance
- [ ] Loading state appears instantly (< 100ms)
- [ ] API response is fast (< 1s)
- [ ] Page refresh loads data quickly (< 2s)
- [ ] No slowdowns or lag

---

## Summary Table

| Test Suite | Topic | Pass | Fail | Notes |
|-----------|-------|------|------|-------|
| 1 | UI Response | ☐ | ☐ | |
| 2 | Success Toast | ☐ | ☐ | |
| 3 | Button State | ☐ | ☐ | |
| 4 | Network Request | ☐ | ☐ | |
| 5 | Console Errors | ☐ | ☐ | |
| 6 | Refresh Persistence | ☐ | ☐ | |
| 7 | Logout/Login Persistence | ☐ | ☐ | |
| 8 | Console After Login | ☐ | ☐ | |
| 9 | Multiple Completions | ☐ | ☐ | |
| 10 | Duplicate Prevention | ☐ | ☐ | |

**Total Passed:** _____ / 10

---

## Overall Result

### Status: ☐ PASS ☐ FAIL ☐ BLOCKED

**If FAIL, list issues:**
1. 
2. 
3. 

**Tester Name:** _________________
**Test Date:** _________________
**Time Spent:** _________________ minutes

---

## Issue Logging Template (if needed)

**Issue #1**
- **Test Suite:** [which test]
- **Step:** [which step failed]
- **Expected:** [what should happen]
- **Actual:** [what actually happened]
- **Severity:** ☐ Critical ☐ High ☐ Medium ☐ Low
- **Screenshot/Console Output:** [paste relevant output]
- **Reproduce Steps:**
  1. 
  2. 
  3. 

---

## Notes for Tester

1. **Don't worry about performance being perfect** - just ensure it's reasonable
2. **Multiple test runs are okay** - helps verify consistency
3. **If you hit an error, take a screenshot** - helps with debugging
4. **Network tab is your friend** - always check for the request you expect
5. **If unsure about DevTools** - ask for a quick tutorial or screenshot guide
6. **Take notes** - what worked, what didn't, any surprises

