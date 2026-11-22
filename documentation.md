# FeelTok documentation

This file describes the project as it is built today. It is updated after every task.

## Overview

FeelTok is a small social app where emotions are central. Users will use it as a mobile app, and admins will use a dashboard in the browser. Both come from the same project.

So far, login works and all other pages are placeholders. The team's designer is still working on those pages.

**Tech stack:** Expo (React Native) with Expo Router, JavaScript only, Firebase Authentication (email and password) and Cloud Firestore. We use the free Firebase plan.

## How to run

1. Install Node.js (LTS) on the computer and **Expo Go** on the phone.
2. Run `npm install` in the project folder.
3. Copy `.env.example` to a new file named `.env` and fill in the Firebase values. Find them in Firebase console → ⚙️ Project settings → General → Your apps → the web app → Config. Never commit `.env`.
4. Run `npx expo start` and scan the QR code with the phone. After changing `.env`, run `npx expo start -c` instead.
5. To open the project in the browser, press **w** in the Expo terminal. The admin dashboard will be here later.

## Folder structure

| Folder or file | What it is for |
|---|---|
| `app/` | The screens. Each file is one page. |
| `app/(tabs)/` | The 4 tabs: Home, Create, Friends, Profile |
| `src/lib/` | Firebase setup |
| `src/features/auth/` | Everything about login |
| `src/components/` | Small pieces shared by many screens |
| `src/constants/` | Fixed lists, such as the 6 emotions |
| `src/theme/` | Colours and fonts |
| `src/utils/` | Helpers: error messages and text checks |
| `__tests__/` | Empty, for tests |
| `assets/` | Images, icons and the logo |
| `firestore.rules` | The database security rules |
| `firestore.indexes.json` | A record of database indexes (none yet) |

## Data model

There are no Firestore collections yet. User accounts (email and password) are in Firebase Authentication.

## Security rules summary

The database is fully locked: nobody can read or write anything. Each task will open only what it needs.

---

### Task 1 — Connect Firebase

**What it does:** The app connects to Firebase. After login, the user sees 4 tabs: Home, Create, Friends and Profile. Each one shows "Coming soon" until its design is ready.

**Files:**
- `.env`: the Firebase keys (not committed)
- `src/lib/firebase.js`: starts Firebase (moved from `src/config/firebase.js`)
- `app/_layout.js`: loads the fonts and shares the login state with all screens
- `app/(tabs)/_layout.js`: the tab bar
- `app/(tabs)/index.js`, `create.js`, `friends.js`, `profile.js`: the 4 placeholder tabs (`index.js` is Home and replaces `app/index.js`)
- `src/components/`: `PlaceholderPage.js`, `EmptyState.js`, `ErrorText.js`, `LoadingSpinner.js`
- `src/constants/emotions.js`: the "Hi Six" emotions from the assignment (Love, Gratitude, Apology, Appreciation, Mindfulness, Thank you)
- `src/theme/colors.js`: the colours from the login design
- `src/utils/errors.js`: friendly error messages
- `src/utils/validation.js`: username rules, login checks and text limits
- `firestore.rules`, `firestore.indexes.json`: security rules and indexes
- `package.json`: added packages for saved logins, choosing pictures, resizing pictures and web support

**Main functions / hooks / components:**
- `startAuth`: starts login and chooses where it is saved (phone storage or browser storage)
- `friendlyError`: turns a Firebase error into a simple message
- `validateUsername`: checks the username rules (used in Task 2)
- `validateLogin`: checks that the email and password are filled in
- `PlaceholderPage`: shows a page name and "Coming soon"
- `EmptyState`, `ErrorText`, `LoadingSpinner`: shared messages and loading screen

**Firestore:** nothing is read or written yet.

**Firebase console steps:** Email/Password login turned on, the Firestore database created, and the locked rules published.

**How to test:**
1. Run `npx expo start -c` and open the app in Expo Go. It opens on the login page without errors.
2. Log in and open each tab. Each one shows its name and "Coming soon".
3. Press **w** in the Expo terminal. The project opens in the browser.

**Notes / limits:** The tabs have no design or icons yet. The tabs also open in the browser for now; Task 5 will limit them to mobile.

### Task 3 — Login + auth hook (login part only)

**What it does:** Users log in with their email and password on the designed login page. A wrong email or password shows a clear message. Users stay logged in after closing the app.

**Files:**
- `app/login.js`: the login page layout from the designer (moved from `app/(auth)/login.js`)
- `src/features/auth/LoginForm.js`: the fields and the Log in button
- `src/features/auth/authService.js`: the calls to Firebase login
- `src/features/auth/AuthContext.js`: shares the logged-in user with all screens
- `app/(tabs)/profile.js`: shows who is logged in, with a temporary log out button

**Main functions / hooks / components:**
- `logIn`: logs in with email and password
- `logOut`: logs out
- `AuthProvider`: listens for login and logout and shares the result
- `useAuth`: gives a screen the user and whether login is still being checked
- `LoginForm`: checks the fields, logs in and shows errors

**Firestore:** nothing is read or written.

**Firebase console steps:** add a test account in Authentication → Users → Add user.

**How to test:**
1. Tap Log in with empty fields. It says "Please enter your email."
2. Enter a wrong password. It says "Wrong email or password."
3. Log in with the test account. Home opens.
4. Close the app fully and open it again. You are still logged in.
5. Open Profile. It shows your email. Tap Log out and the login page opens.

**Notes / limits:**
- The user profile and the admin check wait for sign up (Task 2), because test accounts made in the console have no profile.
- "Forgot password?" and "Create your story" do nothing yet (Tasks 4 and 2).
- The app sends logged-out users to login. Home becomes public in Task 7.
- The red colour for errors is not from the designer yet.
