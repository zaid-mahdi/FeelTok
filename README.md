# FeelTok

FeelTok is a small, text-first social media app where **emotions are central**. Every user shows how they feel right now with one of 6 moods (happy 😊, sad 😢, angry 😠, love ❤️, surprised 😮, funny 😂). Every post has one of the 6 "Hi Six" post types (Love, Gratitude, Apology, Appreciation, Mindfulness, Thank you), and people react to posts with the moods instead of a single "like". Friends are added with invite codes and can chat with each other.

FeelTok is an **MVP** (minimum viable product) built by a university team for SWE6301 Agile Programming. It covers the core features well and leaves out everything that isn't needed for the course (see [Out of scope](#out-of-scope)). See `documentation.md` for the full documentation of every task.

## The platform

FeelTok is **one codebase** that runs in two places:

- **Users** use FeelTok as a **mobile app** on iOS and Android, opened in **Expo Go**. The user app also works in a web browser.
- **Admins** use the **admin dashboard** as a **web page** in a browser, at `/admin`. It is not reachable in the mobile app.

**Tech stack**

- **React Native + Expo** (JavaScript only). Expo lets the same code run on iOS, Android and the web:
  - **Expo Router**: file-based routing; each file in `app/` is a page.
  - **Expo Go**: the app on the phone that runs the project without building it.
  - **Expo web**: the same project in the browser (used for the admin dashboard).
  - Expo packages for photos (`expo-image-picker`, `expo-image-manipulator`, `expo-image`) and copying invite codes (`expo-clipboard`).
- **Firebase** (free Spark plan):
  - **Firebase Authentication**: email and password accounts.
  - **Cloud Firestore**: the only database. Security rules (`firestore.rules`) decide who can read and write what.
  - No Firebase Storage or Cloud Functions (they need the paid plan): photos are resized and compressed on the phone and saved as text (base64) in their own Firestore documents.

## Features

**Accounts**
- Sign up with a unique username, email and password; log in; stay logged in after closing the app.
- Forgot password: a reset link is sent by email.
- Account settings: change username, email (with a verification link) or password, log out, and delete the account (deletes everything: posts, comments, reactions, friends, chats, photo and login).

**Posts and feed**
- New post: pick one of the 6 post types, write up to 500 words, and add at most 1 photo. The post saves the mood you were in when you posted.
- For You feed on Home: all posts, newest first, 10 at a time, readable even when logged out. Cards say "felt sad when posting" and "Posted 2h ago".
- Reactions: react to a post with one of the 6 moods; one reaction per user, tap again to remove or another to switch. Counts and the total are always correct.
- Comments on a separate post page; delete your own comments.
- Delete your own posts (with their photo, comments and reactions).

**Profiles and moods**
- My profile: photo, bio, current mood, post and friend counts, and my posts, filtered by post type.
- Mood tab: pick your current mood, or set it to no mood. It shows on your avatar everywhere.
- Public profiles: open anyone's profile by tapping their name or avatar.

**Friends and messaging**
- Invite codes: everyone has a 6-character code to copy and share; entering a friend's code makes you friends.
- Friend list with each friend's current mood, a search box that filters the list, View profile and Remove friend.
- Messaging: a live chat between two friends (text only, newest 50 messages). Removing a friend deletes the chat.

**Admin dashboard (web)**
- Admin sign-in at `/admin`.
- Dashboard: total users, total posts, blocked users, and the 10 newest posts with Delete.
- Users table with search, and a page per user with all their posts and comments.
- Delete any post or comment. Block / unblock users: a blocked user is logged out at once and can't log in until unblocked. Admins can't be blocked.

## Out of scope

To keep FeelTok an MVP, these are **not** built:

- Editing posts (by owners or admins): a post shows what you felt at that moment
- Email verification at sign up: keeps sign up quick for the MVP
- Replies to comments: one level of comments is enough for short, kind messages
- Live updates of friends' moods in the friend list: the list reloads each time you open the tab or pull to refresh
- Group chats, photos or voice in messages, unread counts, editing or deleting single messages: text chat between two friends covers the main need
- A friends-only feed and private "friends-only" posts: all posts are public in the For You feed
- Videos, or more than 1 picture per post: FeelTok is text-first, and photos are stored in the database without Firebase Storage
- Mood history charts, Emotions Index, Happiness Calendar: FeelTok shows your current mood, which friends can see, instead
- Notifications, including push notifications: they need a server (Cloud Functions, paid plan)
- Group creation: too complex for an MVP; friends chat one to one
- Generating share links: posts and profiles can already be opened by their routes (`/post/{postId}`, `/user/{userId}`)
- Search across the app: Firestore can't search text; only the friend list and the admin Users table filter their own list
- Online status / last seen: not needed for sharing moods
- Reporting posts: admins see the newest posts and can delete any of them
- Deleting users from the admin dashboard: admins block them instead
- Google / Apple sign-in: email and password is enough for the MVP
- Firebase Storage and Cloud Functions: they need the paid Blaze plan

## How to run the project

**You need:** Node.js (LTS), a web browser and a Firebase project (see [Firebase setup](#firebase-setup)). The **Expo Go** app (App Store or Google Play) is only needed to run the mobile version on a phone.

1. Clone the repo and open the folder in a terminal.
2. Install the packages:
   ```
   npm install
   ```
3. Copy `.env.example` to `.env` and fill in your Firebase web config values (see Firebase setup, step 2). Never commit `.env`.
4. Start Expo:
   ```
   npx expo start
   ```
5. **Web:** press `w` in the Expo terminal to open the app in the browser. No phone or Expo Go needed.
6. **Mobile app (optional):** install Expo Go and scan the QR code with the camera (iPhone) or with Expo Go (Android). The phone and the computer must be on the same Wi-Fi.
7. **Admin dashboard:** in the browser, go to `http://localhost:8081/admin` and sign in with an admin account (see [How to make an admin](#how-to-make-an-admin)).

If you change `.env`, or the app seems to run old code, restart with `npx expo start -c` (clears the cache).

## Firebase setup

1. **Create a project:** go to the [Firebase console](https://console.firebase.google.com) → **Add project**. The free Spark plan is enough.
2. **Add a web app:** ⚙️ **Project settings** → **General** → **Your apps** → the **</>** icon → register the app. Copy the values from **SDK setup and configuration → Config** into `.env`:
   `EXPO_PUBLIC_FIREBASE_API_KEY`, `..._AUTH_DOMAIN`, `..._PROJECT_ID`, `..._STORAGE_BUCKET`, `..._MESSAGING_SENDER_ID`, `..._APP_ID`.
3. **Turn on email login:** Build → **Authentication** → **Sign-in method** → **Email/Password** → Enable → Save.
4. **Create the database:** Build → **Firestore Database** → **Create database**.
5. **Security rules:** Firestore Database → **Rules** → replace everything with the contents of `firestore.rules` → **Publish**. Do this again whenever `firestore.rules` changes.
6. **Indexes:** Firestore Database → **Indexes**. Create what `firestore.indexes.json` lists (each entry says which screen needs it):
   - **Composite** tab → Create index, collection `posts`, Collection scope:
     - `authorId` Ascending, `createdAt` Descending
     - `authorId` Ascending, `postType` Ascending, `createdAt` Descending
   - **Single field** tab → Add exemption, **Collection group** scope, only **Ascending** enabled:
     - collection `comments`, field `authorId`
     - collection `reactions`, field `userId`

   Tip: if a screen shows an index error, the Expo terminal prints a link that creates the missing index in one click.

### How to make an admin

Admins are never made in the app; they are set by hand:

1. Sign up in the app with the account that should become an admin.
2. Firebase console → Build → **Authentication** → **Users**: copy that account's **User UID**.
3. Build → **Firestore Database** → **Data** → `users` → the document with that UID.
4. Change the `role` field from `user` to `admin` → **Update**.
5. Open `/admin` in the browser and sign in with that account.

To remove an admin, change `role` back to `user`. Users can never change their own role or blocked status from the app; the security rules stop it.

## File structure

The code is organised **by feature**: each feature has its own folder with its screens' parts, hooks and Firebase calls. Route files in `app/` stay thin and only put those parts together.

| Folder or file | What it contains |
|---|---|
| `app/` | The pages, one file per route (Expo Router) |
| `app/(tabs)/` | The tab bar pages: Home, Friend List, Create, Mood, Profile |
| `app/admin/` | The admin pages (web only): sign-in + dashboard, Users table, one user's page |
| `app/chat/`, `app/post/`, `app/user/` | A chat with a friend, a post with its comments, a public profile |
| `src/features/auth/` | Sign up, login, forgot password, the logged-in user (AuthContext), blocked-user handling |
| `src/features/posts/` | Post Firestore calls and hooks; `feed/` (Home feed and post lists), `card/` (the post card and its parts), `newPost/` (the New post form) |
| `src/features/reactions/` | Reacting with moods and the reaction counts |
| `src/features/comments/` | Comments: list item, input box, Firestore calls |
| `src/features/profile/` | Profiles, avatars with mood rings, the current mood and mood picker |
| `src/features/friends/` | Invite codes, adding and removing friends, the friend list |
| `src/features/chat/` | Messaging between friends |
| `src/features/settings/` | Account settings and deleting the account |
| `src/features/admin/` | Admin Firestore calls and data hook; `signIn/`, `layout/` (sidebar frame, admins-only guard), `dashboard/`, `users/` (table, user card, post card), `parts/` (small shared pieces) |
| `src/components/` | UI pieces shared by many pages (buttons, inputs, pop-ups, tab bar) |
| `src/constants/` | The 6 user moods and the 6 post types (the only place they are listed) |
| `src/lib/firebase.js` | Firebase setup (the only place Firebase is started) |
| `src/theme/` | Brand colours and fonts |
| `src/utils/` | Error messages, input checks, photo helpers, time and text helpers |
| `assets/images/` | Logo, icons and app icons |
| `firestore.rules` | Database security rules (pasted into the Firebase console) |
| `firestore.indexes.json` | Record of the indexes made in the Firebase console |
| `documentation.md` | Full project documentation, task by task |

## License

This project was made for academic purposes, as a university group project for SWE6301 Agile Programming. All rights reserved to the project contributors. No permission is given to copy, change or share this code without their approval.

## Acknowledgments
The following open-source projects were used as references and inspiration during development.

- [firebase-instagram](https://github.com/EvanBacon/firebase-instagram) by Evan Bacon (MIT) — post creation and feed
- [photo-feed-app](https://github.com/chideraike/photo-feed-app) by chideraike (MIT) — authentication and post upload
- [socialdev-firebase](https://github.com/olafsulich/socialdev-firebase) by Olaf Sulich (MIT) — likes and comments logic
- [react-native-user-profile](https://github.com/nattatorn-dev/react-native-user-profile) by nattatorn-dev (MIT) — profile screen layout
- [chat-application-react-native](https://github.com/priyansh7999/chat-application-react-native) by priyansh7999 (MIT) — friend code and friend invitation system
- [InstagramClone](https://github.com/tuuguu21/InstagramClone) by tuuguu21 (Apache 2.0) — comments and likes on posts with Firestore
- [JustTalk](https://github.com/adiksuu/justtalk) by adiksuu (MIT) — real-time messaging and Firebase service structure
