# FeelTok documentation

This file explains how FeelTok works: how to run it, how the data is stored, who may do what, how each feature works, and what every code file does. For a quick introduction, see `README.md`.

**Contents**
1. [Overview](#1-overview)
2. [How to run](#2-how-to-run)
3. [Folder structure](#3-folder-structure)
4. [Data model (Firestore)](#4-data-model-firestore)
5. [Security rules](#5-security-rules)
6. [How each feature works](#6-how-each-feature-works)
7. [Code walkthrough](#7-code-walkthrough)
8. [Firebase console setup](#8-firebase-console-setup)
9. [Testing](#9-testing)
10. [Limits and known issues](#10-limits-and-known-issues)
11. [Task history](#11-task-history)

---

## 1. Overview

FeelTok is a small, text-first social app (an MVP made for a university course) where emotions are central:

- Every user has a **current mood**: one of 6 moods (happy, sad, angry, love, surprised, funny), or no mood. It shows as a coloured ring and emoji on their avatar.
- Every post has a **post type**: one of the 6 "Hi Six" (Love, Gratitude, Apology, Appreciation, Mindfulness, Thank you). A post also saves the mood its author was in when posting.
- People **react** to posts with the 6 moods instead of a single "like".
- Friends are added with **invite codes**, and friends can **chat**.
- **Admins** manage users and posts in a web dashboard.

The moods and the post types are **two separate lists** and are never mixed. "love" is in both, but means a feeling in one and a kind of post in the other.

**Platforms:** users use the app on their phone through **Expo Go** (it also works in a web browser). Admins use the dashboard in a browser at `/admin`; it doesn't exist in the mobile app.

**Tech stack:** React Native with Expo and Expo Router (JavaScript only), Firebase Authentication (email and password) and Cloud Firestore, on the free Spark plan. Without the paid plan there is no Firebase Storage or Cloud Functions, so photos are saved as compressed base64 text in their own Firestore documents, and all checks happen in the Firestore security rules.

## 2. How to run

1. Install Node.js (LTS) on the computer and **Expo Go** on the phone.
2. Run `npm install` in the project folder.
3. Copy `.env.example` to `.env` and fill in the Firebase values (Firebase console → ⚙️ Project settings → General → Your apps → the web app → Config). Never commit `.env`.
4. Run `npx expo start` and scan the QR code with the phone (same Wi-Fi as the computer).
5. Press **w** in the Expo terminal to open the app in the browser. The admin dashboard is at `/admin` in that tab.
6. After changing `.env`, or if the app shows old code, restart with `npx expo start -c`.

The first-time Firebase setup (rules, indexes, making an admin) is in [section 8](#8-firebase-console-setup).

## 3. Folder structure

The code is organised **by feature**. Files in `app/` are the pages and stay thin: they put together the components and hooks of a feature. Each feature folder has three kinds of files:

- **Services** (`...Service.js`): the only files that talk to Firebase.
- **Hooks** (`use...js`): load data for a screen and keep its state (loading, error, the data).
- **Components** (`PascalCase.js`): what is shown on screen.

| Folder or file | What it is for |
|---|---|
| `app/` | The pages. Each file is one route (Expo Router) |
| `app/(tabs)/` | The 5 tabs: Home, Friend List, Create, Mood, Profile |
| `app/post/`, `app/user/`, `app/chat/` | A post with its comments, a public profile, a chat with a friend |
| `app/admin/` | The admin pages (web only) |
| `src/features/auth/` | Sign up, login, forgot password, the logged-in user, blocked users |
| `src/features/posts/` | Posts. At the top: Firestore calls and hooks. `feed/`: the Home feed and post lists. `card/`: the post card and its parts. `newPost/`: the New post form and its parts |
| `src/features/reactions/` | Reacting to posts with a mood |
| `src/features/comments/` | Comments on posts |
| `src/features/profile/` | Profiles, avatars, profile photos, bio and moods |
| `src/features/friends/` | Invite codes, adding and removing friends, the friend list |
| `src/features/chat/` | Messages between two friends |
| `src/features/settings/` | Account settings and deleting the account |
| `src/features/admin/` | The admin area. At the top: Firestore calls and the data hook. `signIn/`, `layout/` (frame and guard), `dashboard/`, `users/`, `parts/` (small shared pieces) |
| `src/components/` | UI pieces shared by many pages |
| `src/constants/` | The 6 moods and the 6 post types (the only place they are listed) |
| `src/lib/` | Firebase setup |
| `src/theme/` | Brand colours and fonts |
| `src/utils/` | Helpers: errors, input checks, photos, times, text, platform |
| `assets/images/` | Logo, icons, app icons |
| `firestore.rules` | The database security rules (the source of truth, pasted into the console) |
| `firestore.indexes.json` | A record of the indexes made in the console, each with a description |

## 4. Data model (Firestore)

**Firebase Authentication** keeps each account's email and password; the email is never saved in Firestore. **Firestore** has 7 collections and 3 sub-collections:

| Collection | Document ID | Fields |
|---|---|---|
| `users` | The user's ID | `username`, `displayName` (= the username), `bio` (up to 150 characters), `hasPhoto`, `mood` (one of the 6 moods or null), `moodUpdatedAt`, `role` ("user" or "admin"), `banned` (true when blocked), `createdAt` |
| `usernames` | The username | `uid`: who owns it. Because the username is the ID, two users can never have the same one |
| `profileImages` | The user's ID | `data` (the photo: 300 x 300 JPEG as base64 text), `updatedAt`. One per user; a new photo replaces the old one |
| `posts` | A new random ID | `authorId`, `authorUsername`, `authorHasPhoto`, `authorMood` (the author's mood when posting, or null), `postType`, `text`, `imageId` (the post's own ID if it has a photo, else null), `reactionCounts` (a count for each of the 6 moods), `commentCount`, `createdAt` |
| `posts/{postId}/reactions` | The ID of the user who reacted | `reaction` (one of the 6 moods), `userId`. One reaction per user per post |
| `posts/{postId}/comments` | A new random ID | `authorId`, `authorUsername`, `text` (up to 500 characters), `createdAt` |
| `postImages` | The post's ID | `ownerId`, `data` (the photo: at most 800 px wide, as base64 text), `createdAt` |
| `inviteCodes` | The code itself (6 characters, no I, O, 0 or 1) | `ownerId`, `usedBy` (null until used), `usedAt`, `createdAt`. Each code works once |
| `friendships` | The two user IDs, sorted and joined with "_" | `members` (the two IDs), `inviteCode` (the code that made it), `createdAt`. The ID makes a second friendship between the same two people impossible |
| `friendships/{id}/messages` | A new random ID | `senderId`, `text` (up to 500 characters), `createdAt` |

**How moods are stored:** the current mood is `users.mood` (+ `moodUpdatedAt`). When a user posts, it is copied into `posts.authorMood` and never changes after that. Reactions are moods too: one document per user in `reactions`, and a count per mood in `posts.reactionCounts`. The total is the sum of the 6 counts (not stored).

**Copied fields:** to show feeds quickly, posts keep a copy of the author's username and photo flag (`authorUsername`, `authorHasPhoto`) and comments keep `authorUsername`. When a user changes their username or photo, the app updates these copies on all their posts and comments.

**Photos:** without Firebase Storage, photos are made small on the phone, turned into base64 text and saved in `profileImages` or `postImages`, never inside the post or profile itself (a Firestore document can be at most 1 MB).

**Several documents at once:** writes that touch more than one document use a **batch** (all or nothing) or a **transaction** (all or nothing, reading first): sign up (profile + username), changing the username, a post with its photo, a reaction with its count, a comment with its count, deleting a post with everything in it, using an invite code with the new friendship, removing a friend with the chat, and deleting an account.

**Live updates:** the app listens live only to the logged-in user's own profile (so a block or a mood change shows at once) and to the open chat. Everything else is loaded when a page opens and with pull to refresh.

## 5. Security rules

The rules in `firestore.rules` protect the data: hiding a button in the app is not enough, because anyone could call Firestore directly. Everything not listed is locked.

**Everyone (even logged out)**
- Can read posts (and list them: the For You feed), comments, reactions, one profile, one profile photo, one post photo, and check whether a username is taken.
- Can't list all users, usernames or photos, and can't write anything.

**Logged-in users who are not blocked**
- **Sign up:** create their own profile and username together, only once, with the starting values (so nobody can sign up as an admin).
- **Profile:** change only their own bio, photo, mood and username (claiming the new username and giving up the old one in the same step). Never their own `role` or `banned`.
- **Posts:** create a post as themselves, with their real username, photo flag and current mood, a valid post type, text that isn't only spaces (up to 5,000 characters) and all counts at 0. A photo is created only together with its post. Posts can't be edited.
- **Reactions:** set, switch or remove only their own reaction; the post's counts must change by exactly that in the same step.
- **Comments:** add as themselves and delete only their own; the post's comment count must change by 1 in the same step.
- **Delete post:** only their own, with its photo, comments and reactions (also other people's) in the same step.
- **Friends:** make their own invite codes; use someone else's unused code only in the same step as the new friendship; read, list and delete only their own friendships.
- **Chat:** only the two friends can read and send, only while they are friends.
- **Delete account:** delete their own profile, username, photo, codes and everything they made.

**Blocked users** can still read, but can't post, react, comment, delete posts, make codes, add or remove friends, or send messages. The app also logs them out and refuses their login.

**Admins** (`role` = "admin", set by hand in the console)
- Can list and count all users, and block or unblock a user (only the `banned` field), but never themselves or another admin.
- Can delete any post (with its photo, comments and reactions) and any comment (with the post's count).
- Can't edit posts, change anyone's role, or read private chats.

## 6. How each feature works

Each feature: what the user sees, then what happens in the code and in Firestore.

### Sign up, login, forgot password
- **Sign up** (`app/signup.js`): username, email, password and confirm password. `SignUpForm` checks the input (`validateSignUp`), then `signUp` in `authService` checks the username is free, creates the account in Firebase Authentication, and `createUserProfile` writes `users/{uid}` and `usernames/{username}` in one transaction. If that fails, the half-made account is removed.
- **Login** (`app/login.js`): `logIn` signs in, then reads the profile. If `banned` is true it logs out again and shows "This account has been blocked by an admin."
- **Staying logged in:** `AuthContext` listens to Firebase Authentication and to the user's own profile (live), and shares `user`, `profile` and `isAdmin` with every screen through `useAuth()`. Login is remembered on the phone (AsyncStorage) and in the browser.
- **Blocked while using the app:** when the live profile turns `banned`, `AuthContext` logs the user out and sends them to the login page, which shows the blocked message once (`blockedNotice`).
- **Forgot password:** sends Firebase's reset email and always shows the same neutral message, so nobody can find out which emails have accounts.

### New post
- The Create tab opens `app/new-post.js` full screen. The user picks a post type (required), writes up to 500 words and can add 1 photo. Their current mood is shown read-only and saved with the post (it is changed only on the Mood tab).
- `pickPhoto` / `preparePostPhoto` crop and compress the photo to base64. `createPost` writes the post and its photo (same ID) in one batch, with all counts at 0.

### For You feed (Home)
- Everyone, even logged out, sees all posts, newest first, 10 at a time; more load at the end of the list, and pulling down reloads.
- `usePaginatedPosts` calls `fetchPostsPage`, which continues after the last loaded post. `addAuthorMoods` reads each author's profile once per page so the avatar rings show their current mood. Each `PostCard` loads its own photo (`PostPhoto`).
- Cards show "felt sad when posting", the post type, "Posted 2h ago", the text, the photo, the top reactions with the total, and the comment count. Logged-out users who try to react or comment go to the login page.

### Reactions
- The React button opens a row of the 6 moods. Tapping one reacts, tapping the same again removes it, tapping another switches.
- `applyReactionChange` updates the counts on screen at once; `setReaction` then saves the reaction and the post's counts in one transaction, and the screen goes back if saving fails.

### Comments
- Comment or "N comments" opens the post page (`app/post/[id].js`). Comments are oldest first, each with the commenter's avatar showing their current mood.
- `addComment` / `deleteComment` write the comment and change `commentCount` in one batch. Users delete only their own comments, after the confirm pop-up.

### Delete own post
- The "•••" menu on your own posts has "Delete post", which asks first (`ConfirmDialog`). `deletePost` deletes the post, its photo, comments and reactions in batches. The admin dashboard uses the same function.

### Profile and Mood tab
- **Profile tab:** photo, @username, mood pill, bio, the numbers (posts, friends, reactions) and my posts, filtered by post type with the chips. **Edit profile** changes the photo and bio. ☰ opens Account settings.
- `saveProfilePhoto` saves the photo with `hasPhoto` and updates the copies on the user's posts; `saveBio` saves the bio. `useProfileStats` adds up the user's posts and reactions.
- **Mood tab:** shows the current mood and when it was set. Tapping a mood picks it; "Set as my mood" saves it (`saveMood`). "Set to no mood" clears it.
- **Public profiles** (`app/user/[uid].js`): the same design, read-only, opened by tapping any name or avatar. Your own profile goes to the Profile tab.

### Friends
- **Invite codes:** "Invite" opens a sheet with your code. `getOrCreateInviteCode` shows your unused code or makes a new one (6 random characters, retrying if taken). Copy uses the clipboard; Share only has the look (team decision).
- **Add friend:** `redeemInviteCode` runs one transaction: the code must exist, be unused, not be yours, and you must not already be friends; then it marks the code used and creates the friendship.
- **Friend list:** `fetchFriends` loads your friendships and each friend's profile, newest mood change first. It loads again each time you open the tab and with pull to refresh or the refresh button; it doesn't change on its own while you look at it. The search box filters the loaded list.
- **Remove friend:** asks first, then `removeFriend` deletes the friendship and the chat's messages.

### Messaging
- The message button on a friend opens `app/chat/[uid].js`. `useChat` listens live (`subscribeToMessages`) to the newest 50 messages, so new ones appear at once. `sendMessage` saves the text with the server's time. Day labels ("Today") and times come from `utils/time.js`.

### Account settings
- One Save button for username, email and password. Email and password changes ask for the current password (`confirmCurrentPassword`). `changeUsername` swaps the username in a transaction and updates the copies on all posts and comments; `changeEmail` sends a verification link to the new address; `changePassword` sets the new one.
- **Delete account:** after the password, `deleteAccount` deletes the user's posts (with photos, comments and reactions), their comments and reactions on other posts (fixing the counts), friendships and chats, invite codes, photo, username and profile, and finally the login account.

### Admin dashboard (web)
- `/admin` shows the admin sign-in page, then the dashboard for admins (non-admins see a message). `AdminShell` draws the sidebar and header; `AdminOnly` sends non-admins away from the other admin pages.
- **Dashboard:** `fetchAdminStats` counts users, posts and blocked users (Firestore counts, nothing downloaded); `fetchRecentPosts` loads the 10 newest posts, each with Delete.
- **Users:** `fetchAllUsers` loads all users with their post counts; the search box filters the list.
- **User page:** `fetchUserWithPosts` loads one user with their posts and comments. Delete post and Delete comment reuse `deletePost` and `deleteComment`. **Block / Unblock** calls `setUserBlocked`, which only changes `banned`.

## 7. Code walkthrough

One line per file: what it contains and does.

### Pages (`app/`)
| File | What it does |
|---|---|
| `_layout.js` | Root layout: loads the fonts and wraps every page in the login state (`AuthProvider`) |
| `(tabs)/_layout.js` | The tab bar; Home is open to everyone, the other tabs need a login |
| `(tabs)/index.js` | Home: the For You feed and the "Posted!" message |
| `(tabs)/friends.js` | Friend List: friends with moods, search, refresh, remove, and the Invite sheet |
| `(tabs)/create.js` | Only sends someone who opens /create to the New post page |
| `(tabs)/mood.js` | Mood tab: current mood, pick a mood, save or clear it |
| `(tabs)/profile.js` | My profile with my posts, Edit profile and Account settings |
| `login.js`, `signup.js`, `forgot-password.js` | The auth pages: the designer's layout around each form |
| `new-post.js` | The New post page (full screen) |
| `post/[id].js` | One post with its comments, the comment box, and deleting own comments |
| `user/[uid].js` | Someone's public profile and posts (read-only) |
| `chat/[uid].js` | The live chat with one friend |
| `admin/_layout.js` | Web only: the mobile app has no admin pages |
| `admin/index.js` | The admin sign-in page, or the dashboard for admins |
| `admin/users.js` | The Users table with search |
| `admin/user/[uid].js` | One user: Block / Unblock, their posts and comments with Delete |

### Auth (`src/features/auth/`)
| File | What it does |
|---|---|
| `authService.js` | `signUp`, `logIn` (refuses blocked users), `sendPasswordReset`, `logOut` |
| `AuthContext.js` | Shares the logged-in user, their live profile and `isAdmin`; logs out users who get blocked |
| `blockedNotice.js` | Remembers that a user was just blocked, so the login page says why once |
| `AuthLayout.js` | The shared layout of the login, sign up and forgot password pages |
| `LoginForm.js` | The login form and its errors |
| `SignUpForm.js` | The sign up form, its checks and the terms text |
| `ForgotPasswordForm.js` | The email field and Send Link button |
| `EmailField.js`, `PasswordField.js` | The email and password inputs (with Show) shared by the forms |

### Posts (`src/features/posts/`)
| File | What it does |
|---|---|
| `postService.js` | `createPost`, `fetchPostsPage`, `fetchPost`, `fetchPostPhoto`, `deletePost`, `fetchAllPostsByAuthor`, `fetchAuthorStats` |
| `usePaginatedPosts.js` | Loads posts 10 at a time, with load more and refresh |
| `usePost.js` | Loads one post and the user's reaction to it (post page) |
| `authorMoods.js` | Adds each author's current mood to a list of posts |
| `postedNotice.js` | Remembers that a post was just made, so Home shows "Posted!" once |
| `feed/ForYouFeed.js` | The For You feed: the post list with all posts |
| `feed/PostList.js` | A list of post cards with loading, empty and error states (feed and profiles) |
| `feed/HomeHeader.js` | The logo and the For You / Friends switch |
| `feed/PostTypeFilter.js` | The All / post type chips on profiles |
| `feed/PostedMessage.js` | The "Posted! Your post is now in the feed." message |
| `card/PostCard.js` | One post: author, mood, type, time, text, photo, counts, React, Comment, Share, ••• |
| `card/PostMenu.js` | The ••• menu with "Delete post" on your own posts |
| `card/PostPhoto.js` | Loads and shows a post's photo |
| `card/PostStats.js` | The top reactions with the total, and the comment count |
| `card/PostTypeTag.js` | The small post type tag |
| `newPost/NewPostForm.js` | The New post form, its checks and the Post button |
| `newPost/PostAuthorMood.js` | The author's avatar, name and current mood (read-only) on New post |
| `newPost/PostTypePicker.js` | The 6 post types in two columns |
| `newPost/PostTextField.js` | The big text box |
| `newPost/PostPhotoField.js` | "Add a photo", or the photo with ✕ |
| `newPost/PostFormSection.js` | A section heading with its note (e.g. "12 / 500 words") |

### Reactions (`src/features/reactions/`)
| File | What it does |
|---|---|
| `reactionService.js` | `setReaction` (reaction + counts in one transaction), `fetchMyReactions` |
| `reactionCounts.js` | Works out the new counts on screen (`applyReactionChange`) and the total |
| `ReactionButton.js` | The React button and the row of 6 moods |

### Comments (`src/features/comments/`)
| File | What it does |
|---|---|
| `commentService.js` | `fetchComments`, `addComment`, `deleteComment` (each with the post's count) |
| `useComments.js` | Loads a post's comments with each commenter's current mood |
| `CommentItem.js` | One comment: avatar, name, time, text, and Delete on your own |
| `CommentInput.js` | The text box with the send button (also used by the chat) |

### Profile and moods (`src/features/profile/`)
| File | What it does |
|---|---|
| `profileService.js` | Profiles and usernames: `subscribeToProfile`, `fetchProfile(s)`, `isUsernameFree`, `createUserProfile`, `saveProfilePhoto`, `fetchProfilePhoto`, `saveBio`, `saveMood` |
| `useUserProfile.js` | Loads one user's profile (public profile, chat header) |
| `useProfilePhoto.js` | Loads a profile photo once and shares it with all avatars of that user |
| `useProfileStats.js` | Counts posts, reactions and (own profile) friends |
| `openUserProfile.js` | Opens a user's public profile page |
| `Avatar.js` | The round photo or initials with the mood ring and emoji |
| `ProfileHeader.js` | The top of a profile: avatar, name, mood, bio, numbers, buttons, chips |
| `ProfileStats.js` | The 3 number boxes |
| `MoodPill.js` | "Feeling happy" under the name |
| `EditProfileModal.js` | The Edit profile pop-up (photo and bio) |
| `CurrentMood.js` | "Right now you're feeling" on the Mood tab, with "Set to no mood" |
| `MoodPicker.js` | The grid of the 6 moods |
| `MoodEmojiCircle.js` | A mood's emoji in a coloured circle |

### Friends (`src/features/friends/`)
| File | What it does |
|---|---|
| `inviteCodeService.js` | `getOrCreateInviteCode`, `deleteMyInviteCodes` |
| `friendService.js` | `redeemInviteCode`, `fetchFriends`, `countFriends`, `removeFriend`, `getFriendshipId`, `fetchMyFriendshipIds` |
| `useFriends.js` | Loads the friend list, with refresh and removing a friend |
| `useInviteCode.js` | Loads my invite code |
| `FriendsHeader.js` | Title with the count, refresh button, search box and Invite button |
| `FriendList.js` | The card with the friend rows (one ⋮ menu open at a time) |
| `FriendRow.js` | One friend: avatar, name, mood tag, message button, ⋮ |
| `FriendMoodTag.js` | "feeling love · 10m" or "No mood set" |
| `FriendMenu.js` | The ⋮ menu: View profile, Remove friend |
| `InviteFriendModal.js` | The "Invite a friend" sheet |
| `InviteCodeCard.js` | My code in coloured letters, with Copy and Share |
| `AddFriendForm.js` | "Got a friend's code?" box and Add friend |

### Chat (`src/features/chat/`)
| File | What it does |
|---|---|
| `chatService.js` | `subscribeToMessages` (live, newest 50), `sendMessage` |
| `useChat.js` | Listens to the chat while the page is open |
| `ChatHeader.js` | Back, the friend's avatar, name and mood |
| `MessageItem.js` | One message bubble with its time, and the day label |

### Settings (`src/features/settings/`)
| File | What it does |
|---|---|
| `accountService.js` | `confirmCurrentPassword`, `changeUsername`, `changeEmail`, `changePassword`, `deleteAccount` |
| `AccountSettingsModal.js` | The Account settings pop-up: fields, Save, Log out, Delete account |
| `DeleteAccountBox.js` | The pink "Delete your account?" box with the password |

### Admin (`src/features/admin/`)
| File | What it does |
|---|---|
| `adminService.js` | `fetchAdminStats`, `fetchRecentPosts`, `fetchAllUsers`, `fetchUserWithPosts`, `setUserBlocked` |
| `useAdminData.js` | Loads a page's data, with loading, error and reload |
| `signIn/AdminAuthLayout.js` | The sign-in page layout: dark brand panel and white card |
| `signIn/AdminSignInForm.js` | The admin sign-in form |
| `layout/AdminShell.js` | The sidebar (logo, Dashboard, Users, admin, Log out) and page header |
| `layout/AdminOnly.js` | Sends non-admins back to `/admin` |
| `dashboard/AdminDashboard.js` | The 3 numbers and the recent posts |
| `dashboard/StatCard.js` | One number card |
| `dashboard/RecentPostRow.js` | One recent post with its counts and Delete |
| `users/UserTable.js` | The Users table |
| `users/AdminUserCard.js` | The user's details with Block / Unblock |
| `users/AdminPostCard.js` | One of the user's posts with its comments and Delete buttons |
| `parts/AdminMoodTag.js` | A small mood tag |
| `parts/AdminStatusBadge.js` | The Active / Blocked badge |
| `parts/AdminDeleteButton.js` | The pink Delete button |

### Shared (`src/components/`, `src/constants/`, `src/lib/`, `src/theme/`, `src/utils/`)
| File | What it does |
|---|---|
| `components/AppTabBar.js` | The bottom tab bar with the pink + button |
| `components/AppModal.js` | The pop-up card (or bottom sheet) with a title and ✕ |
| `components/ConfirmDialog.js` | The "Are you sure?" pop-up with Cancel and a red button |
| `components/PrimaryButton.js` | The purple button |
| `components/TextField.js` | A text input with its label and error |
| `components/BackButton.js`, `CloseButton.js` | The round back and ✕ buttons |
| `components/LoadingSpinner.js`, `EmptyState.js`, `ErrorText.js`, `NoticeText.js` | Loading, empty, error and info messages |
| `components/PlaceholderPage.js` | A "Coming soon" page |
| `constants/moods.js` | The 6 moods with emojis and colours |
| `constants/postTypes.js` | The 6 post types with labels, icons and colours |
| `lib/firebase.js` | Starts Firebase (Auth + Firestore) with the keys from `.env` |
| `theme/colors.js` | The brand colours (the only place with colour codes) |
| `theme/fonts.js` | The font names (Plus Jakarta Sans, Inter) |
| `utils/errors.js` | `friendlyError`: turns Firebase errors into clear messages |
| `utils/validation.js` | Limits and input checks (username, password, post, comment, code, message) |
| `utils/images.js` | Pick a photo, resize, compress, turn into base64 |
| `utils/time.js` | "2h", "Posted yesterday", message times, day labels, "12 Nov 2026" |
| `utils/text.js` | `pluralize`: "1 comment" / "3 comments" |
| `utils/platform.js` | `isWeb`: phone or browser |

## 8. Firebase console setup

1. **Email login:** Authentication → Sign-in method → Email/Password → Enable.
2. **Database:** Firestore Database → Create database.
3. **Rules:** Firestore Database → Rules → paste all of `firestore.rules` → Publish. Do it again whenever the file changes.
4. **Indexes** (Firestore Database → Indexes), as recorded in `firestore.indexes.json`:
   - Composite, collection `posts`: `authorId` Ascending + `createdAt` Descending (a user's posts on profiles).
   - Composite, collection `posts`: `authorId` Ascending + `postType` Ascending + `createdAt` Descending (the post type chips on profiles).
   - Single field exemption, collection group `comments`, field `authorId`, Ascending only (username change and delete account).
   - Single field exemption, collection group `reactions`, field `userId`, Ascending only (delete account).
5. **Make an admin:** sign up in the app, then Firestore Database → Data → `users` → that user's ID → set `role` to `admin`. To undo, set it back to `user`.

## 9. Testing

- **Security rules:** tested with the Firebase emulators and `@firebase/rules-unit-testing`, task by task, plus a final check of what logged-out, normal, blocked and admin users can and can't do.
- **Browser:** each task was tested in the web app against the emulators (automated clicks and typing), and the team tested every task on their phones with Expo Go.
- **Builds:** `npx expo export` for iOS, Android and web after every task.

**Manual demo checklist**
1. Sign up, log out, log in, and reset a password.
2. Make a text post and a photo post; see them on Home.
3. React (switch and remove) and comment from two accounts; the counts stay right.
4. Delete your own post and your own comment.
5. Change your photo, bio and mood; open someone's profile.
6. Add a friend with a code, see their mood, chat, and remove them.
7. Change username, email and password; delete a test account.
8. In the browser at `/admin`: delete a post and a comment, block a user (their phone logs out), unblock them.

## 10. Limits and known issues

- **MVP limits:** posts can't be edited; 1 photo per post; no notifications, search (other than the friend list and admin filters), friends-only feed or group chats. The full list is in the README under "Out of scope".
- **No email verification at sign up.** If the internet drops during sign up, an account without a profile can be left behind.
- **Email change:** Firebase's email enumeration protection sends no link (and gives no error) when the new address is already used by another account.
- **Old reactions:** reactions made before Task 16 have no `userId`, so deleting an account can't find them.
- **Friend list moods** update when the tab is opened or refreshed, not live.
- **Admin Users table** loads all users at once and counts each user's posts; fine for a small number of users.
- **Firebase's password reset page** can't be styled with the FeelTok design.

## 11. Task history

| Task | What was built |
|---|---|
| 1 | Expo + Firebase setup, folder structure, shared components |
| 2 | Sign up with a unique username, forgot password |
| 3 | Login and the login state shared by all screens |
| 4 | Log out (moved into Account settings in Task 16) |
| 5 | Roles, page guards, the admin sign-in page, first security rules |
| 6 | New post page: post type, text, photo, the author's mood |
| 7 | For You feed with pages of 10, the tab bar |
| 8 | Reactions with the 6 moods |
| 9 | Comments on the post page |
| 10 | Delete own post (with photo, comments, reactions) |
| 11 | Profile (photo, bio, mood, my posts) and the Mood tab |
| 12 | Public profiles; post cards say "felt … when posting" |
| 13 | Invite codes and adding friends |
| 14 | Friend list with moods, search, remove friend |
| 15 | Messaging between friends (replaced the out-of-scope Friends feed) |
| 16 | Account settings and delete account; "Set to no mood"; "Posted 2h ago" |
| 17 | Admin dashboard (web) and blocking users |
| 18 | Final polish: clearer folders, clean-up, README, this documentation |
