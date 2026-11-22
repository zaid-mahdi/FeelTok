# FeelTok documentation

This file describes the project as it is built today. It is updated after every task.

## Overview

FeelTok is a small social app where emotions are central. Users will use it as a mobile app, and admins will use a dashboard in the browser. Both come from the same project.

So far, sign up, login and forgot password work and have their final design. All other pages are placeholders. The team's designer is still working on those pages.

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
| `src/features/auth/` | Everything about sign up, login and passwords |
| `src/features/profile/` | Usernames and user profiles |
| `src/components/` | Small pieces shared by many screens |
| `src/constants/` | Fixed lists, such as the 6 emotions |
| `src/theme/` | Colours and fonts |
| `src/utils/` | Helpers: error messages and text checks |
| `__tests__/` | Empty, for tests |
| `assets/` | Images, icons and the logo |
| `firestore.rules` | The database security rules |
| `firestore.indexes.json` | A record of database indexes (none yet) |

## Data model

User accounts (email and password) are in Firebase Authentication. Firestore has 2 collections:

| Collection | Document ID | Fields |
|---|---|---|
| `users` | The user's ID | `username`, `displayName` (same as the username at sign up), `bio` (empty), `hasPhoto` (false), `mood` (null), `moodUpdatedAt` (null), `role` ("user"), `banned` (false), `createdAt` |
| `usernames` | The username | `uid`: the ID of the user who has it |

The username is the document ID, so two users can never have the same one. The email is not saved in Firestore.

## Security rules summary

- Anyone can check if one username is taken, but nobody can list all usernames.
- A new user can create only their own profile and username, both together and only once.
- A new profile must have the starting values, so nobody can sign up as an admin or with extra fields.
- Nobody can read, change or delete profiles from the app yet, and nobody can change or delete usernames.
- Everything else is locked. Each task opens only what it needs.

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

### Task 2 — Sign up with unique username + Forgot password

**What it does:** A new user taps "Create your story" on login or forgot password, enters an email, a username and the password twice, and gets an account. They are logged in straight away, and no email confirmation is needed. A taken username or wrong input shows a clear message. A user who forgot their password taps "Forgot password?" on login, enters their email and gets a reset link by email. The page always shows the same message, so nobody can use it to find out who has an account. A back button returns to login.

**Files:**
- `app/signup.js`: the sign up page layout from the designer
- `src/features/auth/SignUpForm.js`: the sign up fields and button
- `src/features/profile/profileService.js`: the calls to Firestore for usernames and profiles
- `firestore.rules`: the rules for usernames and new profiles
- `app/forgot-password.js`: the forgot password page
- `src/features/auth/ForgotPasswordForm.js`: the email field and the Send Link button
- `src/features/auth/AuthLayout.js`: the logo, title, footer and back button shared by login, sign up and forgot password
- `src/features/auth/EmailField.js`: the email field shared by the 3 pages
- `src/features/auth/PasswordField.js`: the password field with Show/Hide, shared by login and sign up
- `src/components/TextField.js`: the label and input from the design system, with the purple focused style (replaces `authFormStyles.js`)
- `src/components/BackButton.js`: the back button shared by sign up and forgot password
- `src/components/PrimaryButton.js`: the purple button, darker when pressed
- `src/components/NoticeText.js`: good or neutral messages
- `assets/images/icon-back.svg`: the back arrow
- Changed: `app/login.js` and `src/features/auth/LoginForm.js` (use the shared files, and "Forgot password?" and "Create your story" work), `src/theme/colors.js` (the full brand kit palette), `src/features/auth/authService.js` (sign up and reset email), `src/utils/validation.js` (new checks), `src/utils/errors.js` (the "username taken" message)

**Main functions / hooks / components:**
- `signUp`: checks the username, creates the account and saves the profile
- `removeUnfinishedAccount`: deletes a new account if its profile could not be saved
- `isUsernameFree`: checks if nobody uses a username
- `createUserProfile`: saves the username and the profile together
- `createUsernameTakenError`: the error for a taken username
- `validateSignUp`: checks the sign up fields, also that both passwords match
- `SignUpForm`: checks the fields, signs up and shows errors
- `sendPasswordReset`: asks Firebase to send the reset email
- `validateEmail`: checks that the email is filled in
- `ForgotPasswordForm`: checks the email, sends the link and shows the result
- `TextField`, `EmailField`, `PasswordField`: the inputs
- `AuthLayout`, `BackButton`, `PrimaryButton`, `NoticeText`: shared pieces of the pages

**Firestore:** sign up reads and writes `usernames` and writes `users`. Forgot password uses no Firestore data.

**Firebase console steps:** the new `firestore.rules` published in Firestore Database → Rules. No indexes are needed. The reset email text can be changed in Authentication → Templates → Password reset.

**How to test sign up** (publish the rules first):
1. On login, tap "Create your story". The sign up page opens.
2. Tap Sign up with empty fields. It says "Please enter your email."
3. Enter an email and the username "Ab". It says "Username must be 3 to 20 characters."
4. Use the username "Sara K". It says "Username can only have lowercase letters, numbers and underscores."
5. Use a good username and the password "123". It says "Password must be at least 6 characters."
6. Use a good password and a different confirm password. It says "The passwords don't match."
7. Use the email "abc" with good other fields. It says "Please enter a valid email address."
8. Enter a new email, a free username and a good password twice. Home opens.
9. In the Firebase console, check the new user in Authentication, and the new documents in `users` (role is "user") and `usernames`.
10. Log out. Sign up with another email and the same username. It says "This username is already taken."
11. Sign up with the same email and another username. It says "This email is already in use."
12. Turn the internet off and try to sign up. It says there is no internet connection.
13. Log in with the new account. Home opens.
14. On sign up, tap inside each input. It turns white with a purple border.
15. Tap Show on both password fields. Each one shows and hides only its own text.
16. Tap the back button, then open sign up again and tap "Log in" at the bottom. Both open login.

**How to test forgot password:**
1. On login, tap "Forgot password?". The forgot password page opens.
2. Tap Send Link with no email. It says "Please enter your email."
3. Enter "abc". It says "Please enter a valid email address."
4. Enter an email with no account. It says "If an account exists for this email, we've sent a reset link."
5. Enter a test account's email. The same message shows, and the email arrives (check spam).
6. Open the link, choose a new password and log in with it.
7. Tap the back button. It looks the same as on sign up. Login opens.

**Notes / limits:**
- The test account must use a real email address, or no email can arrive.
- The new password is chosen on a Firebase web page, not inside the app.
- The team decided not to add email verification in the MVP, so people can sign up with an email that isn't theirs.
- The display name is the same as the username for now.
- If the internet drops in the middle of a sign up, an account without a profile can be left behind. Delete it in Authentication → Users to free the email.
- Accounts made in the Firebase console have no profile and no username.
- The message below the email field on forgot password is not from the designer yet.
- The inputs and buttons follow the design system (input radius 12, button height 52), also on login and forgot password. The sign up mockup draws its button 2 px taller.

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
- The user profile and the admin check are not in `useAuth` yet. They come next, because sign up now creates profiles.
- The app sends logged-out users to login. Home becomes public in Task 7.
