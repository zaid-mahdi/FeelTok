# FeelTok

A text-first social app where emotions are central. People share posts with their mood and react with the "Hi Six" emotions: Love ❤️, Gratitude 🙏, Apology 😔, Appreciation 👏, Mindfulness 🧘 and Thank you 💐.
It's a group project for SWE6301 Agile Programming. See `documentation.md` for what is built so far.

**Stack:** React Native + Expo (Expo Router, JavaScript) and Firebase (Auth, Firestore).

- **Users** use the mobile app in Expo Go.
- **Admins** will use a dashboard in the browser (not built yet).

## Getting started

1. Install Node.js (LTS) and the **Expo Go** app on your phone.
2. Run `npm install`.
3. Copy `.env.example` to `.env` and fill in the Firebase web config (ask the team; never commit `.env`).
4. Run `npx expo start`, then scan the QR code with Expo Go. Press `w` to open the project in the browser.

If you change `.env`, restart with `npx expo start -c`.

## Folders

The code is organised by feature: everything about login is in one folder, and later features such as posts and friends get their own.

| Folder or file | Purpose |
|---|---|
| `app/` | Pages, one file per route (Expo Router) |
| `src/features/` | One folder per feature, with its components, hooks and Firebase calls (only `auth/` so far) |
| `src/components/` | UI pieces shared by many pages |
| `src/lib/firebase.js` | Firebase setup |
| `src/constants/` | Fixed lists, such as the 6 emotions |
| `src/theme/` | Colours and fonts |
| `src/utils/` | Error messages and text checks |
| `assets/` | Images, icons and the logo |
| `__tests__/` | Empty, for tests |
| `firestore.rules` | Database security rules, pasted into the Firebase console |
| `firestore.indexes.json` | Record of database indexes |
