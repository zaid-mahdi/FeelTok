# FeelTok

A social app built on the "Hi Six" emotions: Love, Gratitude, Apology, Appreciation, Mindfulness and Thank you.
It's a group project for SWE6301 Agile Programming.

**Stack:** React Native + Expo (Expo Router, JavaScript) and Firebase (Auth, Firestore).

## Getting started

1. Install Node.js (LTS) and the **Expo Go** app on your phone.
2. `npm install`
3. Copy `.env.example` to `.env` and fill in the Firebase web config (ask the team; never commit `.env`).
4. `npx expo start`, then scan the QR code with Expo Go. Press `w` to open the web version (admin panel).

## Folders

| Folder | Purpose (MVC) |
|---|---|
| `app/` | Views: screens, one file per route (Expo Router) |
| `src/models/` | Data shapes and Firestore converters |
| `src/controllers/` | Business logic and Firebase calls |
| `src/components/` | Reusable UI pieces |
| `src/config/firebase.js` | Firebase setup |
| `__tests__/` | Jest tests |
