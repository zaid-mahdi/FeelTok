# FeelTok

A text-first social app where emotions are central. Each user shows how they feel with one of 6 moods (happy 😊, sad 😢, angry 😠, love ❤️, surprised 😮, funny 😂). Every post has one of the 6 "Hi Six" post types (Love, Gratitude, Apology, Appreciation, Mindfulness and Thank you), and people react to posts with the moods.
It's a group project for SWE6301 Agile Programming. See `documentation.md` for what is built so far.

**Stack:** React Native + Expo (Expo Router, JavaScript) and Firebase (Auth, Firestore).

- **Users** use the app in Expo Go (it also works in the browser).
- **Admins** sign in at `/admin` in the browser (the dashboard is a placeholder until it is built).

## Getting started

1. Install Node.js (LTS) and the **Expo Go** app on your phone.
2. Run `npm install`.
3. Copy `.env.example` to `.env` and fill in the Firebase web config (ask the team; never commit `.env`).
4. Run `npx expo start`, then scan the QR code with Expo Go. Press `w` to open the project in the browser.

If you change `.env`, restart with `npx expo start -c`.

## How to make an admin

1. Sign up in the mobile app with the account that should become an admin, so it has a profile.
2. Open the Firebase console → your project → Build → **Authentication** → **Users**, and copy that account's **User UID**.
3. Go to Build → **Firestore Database** → **Data** → `users` → the document with that UID.
4. Click the `role` field, change its value from `user` to `admin`, and click **Update**.
5. Open the project in the browser (press **w** in the Expo terminal), go to `/admin` and sign in with that account. The admin dashboard opens.

To remove an admin, change `role` back to `user`. Users can never change their own role from the app.

## Folders

The code is organised by feature: everything about login is in one folder, and later features such as posts and friends get their own.

| Folder or file | Purpose |
|---|---|
| `app/` | Pages, one file per route (Expo Router) |
| `src/features/` | One folder per feature, with its components, hooks and Firebase calls (`auth/`, `profile/`, `posts/`, `reactions/` and `admin/` so far) |
| `src/components/` | UI pieces shared by many pages |
| `src/lib/firebase.js` | Firebase setup |
| `src/constants/` | Fixed lists: the 6 user moods and the 6 post types |
| `src/theme/` | Colours and fonts |
| `src/utils/` | Error messages, text checks, photo helpers and post times |
| `assets/` | Images, icons and the logo |
| `__tests__/` | Empty, for tests |
| `firestore.rules` | Database security rules, pasted into the Firebase console |
| `firestore.indexes.json` | Record of database indexes |
