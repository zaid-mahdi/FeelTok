# FeelTok documentation

This file describes the project as it is built today. It is updated after every task.

## Overview

FeelTok is a small social app where emotions are central. Users will use it as a mobile app, and admins will use a dashboard in the browser. Both come from the same project.

So far, sign up, login and forgot password work and have their final design. Roles work: the app works on phones and in the browser, and admins sign in at `/admin` in the browser. Users can create posts on the New post page, and everyone, even logged out, can read all posts in the For You feed on Home. Logged-in users react to posts with one of the 6 moods, and comment on the post page. Users can delete their own posts. All other pages are placeholders. The team's designer is still working on those pages.

**Tech stack:** Expo (React Native) with Expo Router, JavaScript only, Firebase Authentication (email and password) and Cloud Firestore. We use the free Firebase plan.

## How to run

1. Install Node.js (LTS) on the computer and **Expo Go** on the phone.
2. Run `npm install` in the project folder.
3. Copy `.env.example` to a new file named `.env` and fill in the Firebase values. Find them in Firebase console → ⚙️ Project settings → General → Your apps → the web app → Config. Never commit `.env`.
4. Run `npx expo start` and scan the QR code with the phone. After changing `.env`, run `npx expo start -c` instead.
5. To open the app in the browser, press **w** in the Expo terminal. To open the admin area, go to `/admin` in that browser tab and sign in with an admin account (see "How to make an admin" in the README).

## Folder structure

| Folder or file | What it is for |
|---|---|
| `app/` | The screens. Each file is one page. |
| `app/(tabs)/` | The 5 tabs: Home, Friend List, Create (opens the New post page), Mood, Profile |
| `app/post/` | The post page: one post with its comments |
| `app/user/` | Public profile pages: someone else's profile and posts |
| `app/admin/` | The admin area: admin sign-in and dashboard (web only) |
| `src/lib/` | Firebase setup |
| `src/features/auth/` | Everything about sign up, login and passwords |
| `src/features/profile/` | Usernames, user profiles, the avatar (photo or initials), profile photo, bio and current mood |
| `src/features/posts/` | Posts: the New post page, the post list (For You feed and my posts) and the post card |
| `src/features/reactions/` | Reacting to posts with a mood: the React button and its Firestore calls |
| `src/features/comments/` | Comments: the comment box, one comment, and their Firestore calls |
| `src/features/admin/` | The admin sign-in page |
| `src/components/` | Small pieces shared by many screens |
| `src/constants/` | Fixed lists: the 6 user moods and the 6 post types (two separate lists) |
| `src/theme/` | Colours and fonts |
| `src/utils/` | Helpers: error messages, text checks, photos, post times, confirm questions and the web/mobile check |
| `__tests__/` | Empty, for tests |
| `assets/` | Images, icons and the logo |
| `firestore.rules` | The database security rules |
| `firestore.indexes.json` | A record of database indexes (two so far: a user's posts, newest first, with or without one post type) |

## Data model

User accounts (email and password) are in Firebase Authentication. Firestore has 5 collections, and posts have `reactions` and `comments` sub-collections:

| Collection | Document ID | Fields |
|---|---|---|
| `users` | The user's ID | `username`, `displayName` (same as the username at sign up), `bio` (empty), `hasPhoto` (false), `mood` (null), `moodUpdatedAt` (null), `role` ("user"), `banned` (false), `createdAt` |
| `usernames` | The username | `uid`: the ID of the user who has it |
| `posts` | A new ID | `authorId`, `authorUsername`, `authorHasPhoto`, `authorMood` (one of the 6 moods or null), `postType` (one of the 6 post types), `text`, `imageId` (the post's own ID if it has a photo, or null), `reactionCounts` (0 for each of the 6 moods), `commentCount` (0), `createdAt` |
| `posts/{postId}/reactions` | The ID of the user who reacted | `reaction`: one of the 6 moods. One per user per post |
| `posts/{postId}/comments` | A new ID | `authorId`, `authorUsername`, `text` (up to 500 characters), `createdAt`. The commenter's mood is not saved: their avatar reads their current mood from their profile |
| `postImages` | The post's ID | `ownerId`, `data` (the photo as base64 text), `createdAt` |
| `profileImages` | The user's ID | `data` (the profile photo: a 300 x 300 px JPEG as base64 text), `updatedAt`. One per user; a new photo replaces the old one |

The username is the document ID, so two users can never have the same one. The email is not saved in Firestore.

There are two separate lists of six: the **moods** (happy, sad, angry, love, surprised, funny) for how a user feels (their current mood), a post's mood and reactions to posts; and the **post types** (love, gratitude, apology, appreciation, mindfulness, thank_you) for what kind of post it is.

## Security rules summary

- Anyone can check if one username is taken, but nobody can list all usernames.
- A new user can create only their own profile and username, both together and only once.
- A new profile must have the starting values, so nobody can sign up as an admin or with extra fields.
- Anyone can read one user's profile, but nobody can list all profiles.
- Users can edit only their own display name, bio (up to 150 characters), photo flag and mood (one of the 6 user moods, or none). They can never change their own role, blocked status, username or join date, so nobody can make themselves an admin. The photo flag must say whether their profile photo really exists.
- Anyone can read one profile photo. Users can save only their own (up to 300,000 characters of base64 text), together with turning their photo flag on. Profile photos can't be removed yet.
- Nobody can delete profiles from the app yet, and nobody can change or delete usernames.
- A logged-in user who is not blocked can create a post as themselves, with their real username, a valid type and mood, text that isn't empty (up to 5,000 characters) and all counts at 0.
- A post photo can only be created together with its post, by its author, and must be small enough for one document.
- Anyone, even logged out, can read posts and list them (the For You feed), and read one post photo at a time. Nobody can list all photos.
- Anyone can read reactions. A logged-in user who is not blocked can set, switch or remove only their own reaction (one of the 6 moods), on any post including their own.
- The only changes to a post are its reaction counts (only by exactly what the user's own reaction adds or removes in the same step), its comment count (see below), and, by its author only, the copies of their username and photo flag, which must match their profile.
- Anyone can read comments. A logged-in user who is not blocked can add comments as themselves (up to 500 characters, not only spaces) and delete only their own. Deleting other people's comments is for admins (Task 17). Comments can't be edited.
- Adding or deleting a comment must change the post's comment count by exactly 1 in the same step.
- Authors can delete their own posts, always together with the post's photo. When a post is deleted, its author may delete all its comments and reactions (also other people's) in the same step. Comments and reactions left over from a deleted post can be cleaned up by any logged-in user.
- Posts and photos can't be edited.
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

**What it does:** A new user taps "Create your story" on login or forgot password, enters a username, an email and the password twice, and gets an account. The Create account button stays grey until all four fields are filled in. They are logged in straight away, and no email confirmation is needed. A taken username or wrong input shows a clear message. A user who forgot their password taps "Forgot password?" on login, enters their email and gets a reset link by email. The page always shows the same message, so nobody can use it to find out who has an account. A back button returns to login.

**Files:**
- `app/signup.js`: the sign up page layout from the designer
- `src/features/auth/SignUpForm.js`: the sign up fields and button
- `src/features/profile/profileService.js`: the calls to Firestore for usernames and profiles
- `firestore.rules`: the rules for usernames and new profiles
- `app/forgot-password.js`: the forgot password page
- `src/features/auth/ForgotPasswordForm.js`: the email field and the Send Link button
- `src/features/auth/AuthLayout.js`: the logo, title, footer and back button shared by login, sign up and forgot password
- `src/features/auth/EmailField.js`: the email field shared by login and forgot password
- `src/features/auth/PasswordField.js`: the password field with Show/Hide, shared by login and sign up
- `src/components/TextField.js`: the label and input from the design system, with the purple focused style, an optional "@" prefix and hint text below (replaces `authFormStyles.js`)
- `src/components/BackButton.js`: the back button shared by sign up and forgot password
- `src/components/PrimaryButton.js`: the purple button, darker when pressed and grey when it can't be used yet
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
1. On login, tap "Create your story". The sign up page opens. The Create account button is grey.
2. Fill in only three fields. The button stays grey and does nothing. Fill in the fourth and it turns purple.
3. Use the username "Ab". It says "Username must be 3 to 20 characters."
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
15. Tap Show on the password. It shows and hides the password. The confirm password has no Show button.
16. Tap the back button. Login opens. Open sign up again and tap "Log in" at the bottom. Login opens.

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
- Sign up follows the designer's newest mockup: username first, an "@" before the username, hints under the username and password, the terms sentence under the button, and "Already have an account? Log in" at the bottom.
- The password hints say 6 characters, because the team kept the 6 character minimum. The mockup said 8 with a letter and a number.
- "Terms" and "Community guidelines" are not links yet, because those pages don't exist.
- Sign up uses a slightly smaller logo, title and inputs than login, as in its mockup.
- Buttons are 54 px high on all pages, as in every mockup. The design system says 52.

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
- The user profile and the admin check were added to `useAuth` in Task 5.
- The app sends logged-out users to login. Home becomes public in Task 7.

### Task 4 — Logout

**What it does:** The team decided that logout belongs in Settings, which opens from the Profile page (Task 16). Until then, the temporary Log out button on the Profile placeholder stays, so the team can keep testing.

**Files:** none changed.

**Notes / limits:** Logout returns to login for now. When Home becomes public (Task 7), it returns to Home.

### Task 5 — Roles + route guards

**What it does:** The app now knows each user's profile and whether they are an admin. The normal app works on phones and in the browser. The admin area is at `/admin` in the browser: it shows the admin sign-in page, and the admin dashboard once an admin has signed in. A logged-in user who is not an admin sees "not an admin" there and stays logged in to the normal app. The mobile app has no admin area. The security rules stop anyone from making themselves an admin.

**Files:**
- `src/utils/platform.js`: the one place that says if the app runs on the web or on a phone
- `src/features/auth/AuthContext.js`: now also shares the live profile, the admin check and profile errors
- `src/features/profile/profileService.js`: listens to a user's profile
- `src/lib/firebase.js`: uses the shared web/mobile check
- `app/admin/_layout.js`: the admin area exists only on the web; the mobile app goes to Home
- `app/admin/index.js`: the admin page: the sign-in form, or the dashboard placeholder for admins
- `src/features/admin/AdminAuthLayout.js`: the admin sign-in layout from the designer (dark brand panel and white card)
- `src/features/admin/AdminSignInForm.js`: the admin sign-in form
- `app/forgot-password.js`: its back button now returns to the page that opened it (login or the admin page)
- `src/constants/moods.js` and `src/constants/reactions.js`: the 6 user moods and the 6 post reactions, kept separate (they replace `emotions.js`)
- `src/theme/colors.js`: the colours of the dark admin panel
- `assets/images/feeltok-logo-reversed.svg`: the white logo for dark backgrounds; `icon-lock.svg`: the lock icon in the admins-only note
- `firestore.rules`: anyone can read a profile; users can edit only safe fields of their own profile
- `README.md`: how to make an admin

**Main functions / hooks / components:**
- `isWeb`: true in the browser, false in the mobile app
- `subscribeToProfile`: listens to a user's profile and reports every change
- `useAuth`: now gives user, profile, profileError, isAdmin and isLoading
- `AdminLayout`: keeps the admin area out of the mobile app
- `AdminScreen`: shows the sign-in form or the dashboard placeholder
- `AdminAuthLayout`, `AdminSignInForm`: the admin sign-in page
- `USER_MOODS`, `POST_REACTIONS`: the two separate emotion lists

**Firestore:** reads `users` (the logged-in user's own profile, live).

**Firebase console steps:**
- Publish the new `firestore.rules` in Firestore Database → Rules.
- Make a test account an admin: see "How to make an admin" in the README.

**How to test:**
1. On a phone, log in with a normal account. The tabs open as before.
2. In the browser, log in with the same normal account on the normal login page. The normal app opens.
3. In the browser, open `/admin` while logged in as the normal user. The admin sign-in page says the account is not an admin. "Back to FeelTok" returns to the app, still logged in.
4. Make another account an admin in the Firebase console. Open `/admin` and sign in with it. The dashboard placeholder shows "Signed in as admin @username".
5. Tap "Reset password". The forgot password page opens, and its back button returns to the admin page.
6. While the admin is on the dashboard, change their `role` to `user` in the console. The page switches to the sign-in form with the "not an admin" message.
7. On a phone, log in with the admin account. The normal tabs open. There is no admin area in the mobile app.

**Notes / limits:**
- The admin dashboard is a placeholder until Task 17.
- New admins are still made by hand in the Firebase console. Nobody can sign up as an admin.
- The designer's note under the Sign in button also said sign-ins are logged and protected with two-step verification. FeelTok has neither (two-step verification needs Firebase's paid plan), so that part was removed.
- An admin is also a normal user: logging in on the normal login page opens the normal app.
- Accounts made only in the Firebase console have no profile, so they can't be admins. Make admins from accounts that signed up in the app.
- In the browser, the admin check always waits for the server, so an old saved role is never used.
- The white logo was made from the brand kit's rule (overlap and wordmark white on Midnight Ink). The designer should confirm it.
- The mockup's "Keep me signed in" checkbox was left out (team decision): admins stay signed in, like everyone else.
- The "not an admin" message is not in the mockup.

### Task 6 — Create post

**What it does:** Tapping the Create tab opens the full-screen New post page from the designer's mockup. The user picks one of the 6 post types (required), writes up to 500 words (required) and can add one photo. The post's mood starts on the user's current mood. "Change mood" changes it for this post only, or clears it with "No mood". The Post button stays grey until a type is picked and some text is written. After posting, the page closes and Home opens.

**Files:**
- `app/new-post.js`: the New post page: the header with ✕ and the form. Logged-out users go to login
- `app/(tabs)/_layout.js`: tapping Create opens the New post page; the new Mood tab
- `app/(tabs)/create.js`: sends anyone who opens `/create` to the New post page
- `app/(tabs)/mood.js`: the Mood tab, a placeholder until its design is ready
- `src/features/posts/postService.js`: saves a post, and its photo, together
- `src/features/posts/NewPostForm.js`: the form, its checks and the bar with the Post button
- `src/features/posts/PostAuthorMood.js`: the avatar, name, the post's mood and "Change mood"
- `src/features/posts/PostTypePicker.js`: the 6 post types in two columns
- `src/features/posts/PostTextField.js`: the big text box
- `src/features/posts/PostPhotoField.js`: "Add a photo", or the photo with a remove (✕) button
- `src/features/posts/PostFormSection.js`: a section heading with its note ("Required", the word count)
- `src/features/profile/Avatar.js`: a round avatar with initials and a ring in the mood's colour
- `src/components/CloseButton.js`: the round ✕ button
- `src/components/PrimaryButton.js`: can now take extra spacing
- `src/constants/postTypes.js`: the 6 post types with their labels, icons and colours (replaces `reactions.js`)
- `src/constants/moods.js`: now also has each mood's ring and tint colour
- `src/theme/colors.js`: the mood colours and the light pink and light purple tints
- `src/utils/images.js`: picks a photo, makes it smaller and turns it into text for Firestore
- `src/utils/validation.js`: the 500-word limit and the post checks
- `src/utils/errors.js`: messages for photos that are too big
- `src/features/admin/AdminAuthLayout.js`: its tags now read from the post types list
- `assets/images/`: the 6 post type icons, and the close and photo icons
- `firestore.rules`: who can create posts and post photos

**Main functions / hooks / components:**
- `createPost`: saves the post and its photo in one batch, so neither is saved without the other
- `pickPhoto`: opens the photo library with cropping, and refuses files over 10 MB
- `preparePostPhoto`: makes the photo at most 800 px wide and compresses it until it fits in Firestore
- `countWords`, `validatePost`: count the words and say what is still missing
- `NewPostForm`, `PostAuthorMood`, `PostTypePicker`, `PostTextField`, `PostPhotoField`, `PostFormSection`: the parts of the page
- `Avatar`: initials in a purple circle, with a ring in the colour of the user's current mood
- `POST_TYPES`: the 6 post types

**Firestore:** writes `posts` and `postImages`; reads the user's own profile through `useAuth`.

**Firebase console steps:**
- Publish the new `firestore.rules` in Firestore Database → Rules.
- No index is needed.

**How to test:**
1. Tap Create. The New post page opens full screen, with your name and current mood at the top.
2. The Post button is grey, and the bar says "Pick a post type and write something to post".
3. Pick a type and write some text. The word count goes up and Post turns purple.
4. Type only spaces. Post stays grey. Paste more than 500 words: the count turns red and Post stays grey.
5. Tap "Change mood", pick another mood. Only the post's mood changes; your avatar ring stays the same.
6. Tap "Add a photo", pick and crop a photo. A preview appears. Tap ✕ on it to remove it, then add it again.
7. Tap Post. The page closes and Home opens. In the Firebase console, check the new post in `posts` and its photo in `postImages` (same ID).
8. Post again without a photo and with "No mood". The post has `imageId` null and `authorMood` null.
9. Tap ✕ at the top. The page closes without posting.

**Notes / limits:**
- The team changed the plan: Love, Gratitude, Apology, Appreciation, Mindfulness and Thank you are now **post types** (one per post, required). People will react to posts with the **6 moods** (Task 8). Each new post starts with 0 reactions for each mood.
- Posts can't be read yet. The feed comes in Task 7.
- Team decisions: users can react to their own posts (Task 8), and the Mood tab is built in Task 11.
- A photo uses its post's ID as its own ID. The rules only accept a photo that is created together with its post, by the same user.
- The rules can't count words, so they limit the text to 5,000 characters. The app limits it to 500 words.
- Photos are saved as JPEG, at most 800 px wide and under 900,000 characters of text, so they always fit in one Firestore document.
- Avatars show initials until profile photos are added (Task 11).
- The mockup's text box shows "[object Object]" (a mistake in the design file), so the app uses "What's on your mind?" until the designer gives the real text.
- The mood list that opens from "Change mood", the selected post type look and the photo preview are not in the mockup.
- The Mood tab is a placeholder. Changing your current mood comes later.
- Accounts made only in the Firebase console have no profile, so they can't post.

### Task 7 — Public "For You" feed + pagination

**What it does:** Home now shows the For You feed from the designer's mockup: every post, newest first, also for logged-out users. It loads 10 posts at a time and loads the next 10 when you scroll near the end. Pulling down refreshes it, and it also refreshes when you come back to Home, so a new post shows at the top, with a short "Posted!" message. The app has the designed tab bar: Home, Friend List, Create, Mood and Profile. Logged-out users can read Home; tapping any other tab sends them to login.

**Files:**
- `app/(tabs)/index.js`: Home: the header, the For You feed (Friends shows a placeholder until Task 15) and the "Posted" message
- `app/new-post.js`: tells Home that a post was just saved
- `src/features/posts/PostedMessage.js`: the "Posted! Your post is now in the feed." message, shown for 3 seconds
- `src/features/posts/postedNotice.js`: remembers that a post was just saved, so Home shows the message once
- `src/theme/colors.js`: the light green behind the message
- `app/(tabs)/_layout.js`: the designed tab bar; Home is public, the other tabs need a login
- `app/(tabs)/friends.js`, `mood.js`: send logged-out users to login
- `app/(tabs)/profile.js`: goes to Home after logging out
- `src/components/AppTabBar.js`: the tab bar from the mockup
- `src/features/posts/HomeHeader.js`: the logo and the For You / Friends switch
- `src/features/posts/ForYouFeed.js`: the list: loading, empty and error states, pull to refresh, loading more
- `src/features/posts/usePaginatedPosts.js`: loads the posts page by page
- `src/features/posts/PostCard.js`: one post: author, mood, time, type, text with "see more", photo, counts, Share
- `src/features/posts/PostTypeTag.js`: the small post type tag
- `src/features/posts/PostPhoto.js`: loads and shows a post's photo
- `src/features/posts/PostStats.js`: the top 3 reactions with the total, and the number of comments
- `src/features/posts/postService.js`: now also reads a page of posts and a post's photo
- `src/features/profile/Avatar.js`: now has the mood emoji badge, and each user gets one of three circle colours
- `src/utils/time.js`: shows when a post was made ("2h", "Yesterday")
- `assets/images/`: the tab bar icons and the Share icon
- `firestore.rules`: anyone can read posts and post photos

**Main functions / hooks / components:**
- `fetchPostsPage`: loads 10 posts, newest first, starting after the last one already loaded
- `fetchPostPhoto`: loads one post's photo
- `usePaginatedPosts`: gives the posts, the loading states and `loadMore`, `refresh` and `retry`
- `ForYouFeed`, `PostCard`, `PostTypeTag`, `PostPhoto`, `PostStats`, `HomeHeader`, `AppTabBar`: the parts of the page
- `formatPostTime`: turns a date into "Just now", "5m", "2h", "Yesterday", "3d" or a date

**Firestore:** reads `posts` (newest first, 10 at a time) and `postImages` (one per post with a photo).

**Firebase console steps:**
- Publish the new `firestore.rules` in Firestore Database → Rules.
- No index is needed: sorting by one field works without one.

**How to test:**
1. Log out, then open the app. Home shows all posts, newest first, without logging in.
2. With more than 10 posts, scroll down. More posts load at the end until the oldest one.
3. Pull down from the top. The feed reloads.
4. A long post shows "...see more". Tap it and the whole text shows.
5. A post with a photo shows it across the card. The card shows the author, "feeling <mood>", the time, the post type tag, the reactions total and the comments count.
6. Logged out, tap Friend List, Create, Mood or Profile. The login page opens.
7. Log in, tap Create and post something. Back on Home, "Posted! Your post is now in the feed." shows for 3 seconds and the new post is at the top. Closing New post with ✕ shows no message.
8. Tap "Friends" at the top. It says "Coming soon" (Task 15).
9. With no posts at all, Home says "No posts yet. Be the first!". With no internet, it shows an error and "Try again".

**Notes / limits:**
- Your own posts show in the For You feed too (team decision). The "Posted" message is not in the mockups yet.
- Team decisions for this mockup: the card shows only the @username (no full name), Share is only the look (it does nothing), and React and Comment are hidden until Tasks 8 and 9.
- The "•••" menu on each card is hidden until Task 10 (delete post).
- The Friends feed is a placeholder until Task 15.
- The avatar ring and emoji badge show the mood the author picked for that post.
- Avatar circle colours (purple, pink or Midnight Ink) are picked from the username, so the same user always has the same colour.
- Photos are loaded one by one for each card and kept while the app is open.
- "See more" shows on posts over 180 characters or 4 lines.

### Task 8 — Post reactions

**What it does:** Each post card has a React button. Tapping it opens a row of the 6 moods (😊 😢 😠 ❤️ 😮 😂), from the designer's mockup. Picking one reacts with it, and the button then shows that mood (for example "❤️ Love"). Each user has at most one reaction per post: tapping the same mood again removes it, and picking another one switches to it. The counts and top emojis under the post change straight away. Users can react to their own posts. Logged-out users who tap React are sent to login.

**Files:**
- `src/features/reactions/reactionService.js`: saves a reaction and its count together, and reads the user's reactions
- `src/features/reactions/ReactionButton.js`: the React button and the row of 6 moods above it
- `src/features/reactions/reactionCounts.js`: works out the new counts for the instant update on screen
- `src/features/posts/PostCard.js`: shows the React button, updates the counts straight away and puts them back if saving fails
- `src/features/posts/usePaginatedPosts.js`: also loads the user's own reaction to each post on the page
- `src/features/posts/ForYouFeed.js`: passes the logged-in user to the feed
- `src/constants/moods.js`: each mood now has a label ("Happy", "Love")
- `firestore.rules`: who can react, and how the counts may change

**Main functions / hooks / components:**
- `setReaction`: sets, switches or removes the user's reaction in one transaction, with the post's counts
- `fetchMyReactions`: reads the user's reaction to each post on a page
- `applyReactionChange`: takes 1 from the old mood and adds 1 to the new one
- `ReactionButton`: the button and the mood row

**Firestore:** reads and writes `posts/{postId}/reactions/{userId}`, and updates `reactionCounts` on `posts`.

**Firebase console steps:**
- Publish the new `firestore.rules` in Firestore Database → Rules.
- No index is needed: each reaction is read directly by its post and user ID.

**How to test:**
1. Logged out, tap React on a post. The login page opens.
2. Log in. Tap React: the row of 6 moods opens. Tap ❤️. The button shows "❤️ Love" and the total goes up by 1.
3. Tap the button and pick 😊. It switches to "😊 Happy" and the total stays the same.
4. Tap the button and pick 😊 again. The reaction is removed, the button says "React" and the total goes down by 1.
5. Close and reopen the app. Your reaction is still shown.
6. React to your own post. It works.
7. With two accounts, react to the same post. Check in the console that `reactionCounts` matches the documents in that post's `reactions`.
8. Turn off the internet and react. The button goes back and an error shows.

**Notes / limits:**
- Reactions are the 6 moods (team decision 2026-11-24). Post types are never reactions.
- The rules check every count change against the user's own reaction in the same step, so the counts can't be changed any other way.
- The Comment button stays hidden until Task 9. Share is still only the look.
- Blocked users can't react or remove their reaction (blocking comes in Task 17).
- The row of moods closes when you pick one or tap React again.

### Task 9 — Comments

**What it does:** Tapping Comment or "N comments" on a post opens the post page: the post, the comment box ("Say something kind..." with a round send button, from the designer's mockup) and the comments, oldest first. Each comment shows the commenter's avatar with their current mood, their username, the time and the text. Logged-in users can add comments and delete their own (a small "Delete" link, which asks first). Logged-out users can read comments and see "Log in to comment".

**Files:**
- `app/post/[id].js`: the post page: the header with a back button, the post, the comment box and the comments
- `src/features/comments/commentService.js`: reads, adds and deletes comments, with the post's comment count
- `src/features/comments/useComments.js`: loads the comments and the commenters' profiles, and adds or deletes comments
- `src/features/comments/CommentInput.js`: the comment box and send button
- `src/features/comments/CommentItem.js`: one comment, with "Delete" on your own comments
- `src/features/posts/usePost.js`: loads one post and your reaction to it
- `src/features/posts/PostCard.js`: the Comment button; can show the whole text on the post page
- `src/features/posts/PostStats.js`: "N comments" opens the post page
- `src/features/posts/postService.js`: reads one post
- `src/features/profile/profileService.js`: reads several profiles at once (for the commenters' moods)
- `src/utils/confirm.js`: asks "Are you sure?" on phones and in the browser
- `src/utils/validation.js`: the 500-character comment limit
- `assets/images/`: the comment and send icons
- `firestore.rules`: who can read, add and delete comments

**Main functions / hooks / components:**
- `fetchComments`, `addComment`, `deleteComment`: the comment calls; adding and deleting also change the post's count in the same batch
- `useComments`, `usePost`: the post page's data
- `fetchPost`, `fetchProfiles`: read one post, and several profiles
- `CommentInput`, `CommentItem`: the parts of the page
- `confirmAction`: the "Delete this comment?" question

**Firestore:** reads `posts`, `posts/{postId}/comments` (oldest first) and `users` (the commenters' moods); writes `posts/{postId}/comments` and the post's `commentCount`.

**Firebase console steps:**
- Publish the new `firestore.rules` in Firestore Database → Rules.
- No index is needed: one post's comments are sorted by a single field.

**How to test:**
1. Logged out, tap Comment on a post. The post page opens with its comments and "Log in to comment".
2. Log in. Tap "N comments" on a post. The post page opens.
3. Tap Comment on the post page. The cursor goes into the comment box. The send button is faded until you type.
4. Write a comment and send it. It shows at the bottom, the box empties and the count goes up by 1.
5. Your comment has "Delete"; other people's don't. Tap Delete, confirm. It's gone and the count goes down by 1.
6. A commenter's avatar shows their current mood (change it in the console and reopen the page).
7. A post with no comments says "No comments yet".
8. Go back. The feed shows the new comment count.

**Notes / limits:**
- Team decisions: comments are on a separate post page, and users can only delete their own comments. The post's author can't delete other people's comments; that is for admins in Task 17.
- Comments can't be edited, and there are no replies (out of scope).
- Comments are up to 500 characters. All comments of a post load at once (no pages).
- The rules can check that the comment count changes by exactly 1, but not which comment it belongs to, so the count could drift only through someone writing their own requests outside the app.
- The "Delete" link and the "Log in to comment" text are not in the mockup.

### Task 10 — Delete own post

**What it does:** Your own posts have a "•••" button in the top corner (other people's posts don't). It opens a small menu with "Delete post", from the designer's mockup. After you confirm, the post is deleted together with its photo, all its comments and all its reactions, so nothing is left behind. In the feed the card disappears; on the post page you go back.

**Files:**
- `src/features/posts/PostMenu.js`: the "•••" button and its menu with "Delete post"
- `src/features/posts/PostCard.js`: shows the menu only on your own posts, asks first and deletes
- `src/features/posts/postService.js`: `deletePost` deletes the post with everything that belongs to it
- `src/features/posts/usePaginatedPosts.js`, `ForYouFeed.js`: take a deleted post off the feed
- `app/post/[id].js`: goes back after the post is deleted
- `assets/images/`: the "•••" and trash icons
- `firestore.rules`: who can delete posts, photos, and a deleted post's comments and reactions

**Main functions / hooks / components:**
- `deletePost`: deletes the post, its photo, comments and reactions in one batch (more batches only for a post with hundreds of them). The admin dashboard will reuse it (Task 17)
- `PostMenu`: the "•••" menu
- `removePost` (in `usePaginatedPosts`): takes a post off the feed

**Firestore:** reads `posts/{postId}/comments` and `posts/{postId}/reactions`; deletes them, `posts/{postId}` and `postImages/{postId}`.

**Firebase console steps:**
- Publish the new `firestore.rules` in Firestore Database → Rules.
- No index is needed.

**How to test:**
1. Logged out, no post has "•••".
2. Log in. Only your own posts have "•••".
3. Tap "•••": the menu shows "Delete post". Tap it and cancel: nothing changes.
4. Tap "Delete post" again and confirm. The card disappears.
5. In the console, the post, its `postImages` document and its comments and reactions (also other people's) are all gone.
6. Open one of your posts, delete it from the post page. You go back to the feed.

**Notes / limits:**
- Posts can't be edited (MVP).
- Only the author can delete a post from the app. Admins will delete any post in Task 17, with the same `deletePost`.
- The menu's only action is "Delete post" (team decision).
- Deleting asks first with the phone's own dialog, or the browser's confirm box on the web.

### Task 11 — My profile

**What it does:** The Profile tab is built from the designer's mockup. At the top: a share button (look only), your @username and a ☰ button. Then your avatar (photo or initials, with your mood ring and emoji), your name, a "Feeling happy" mood pill that opens the Mood tab, your bio, and three numbers: posts, friends and reactions (all reactions your posts got). "Edit profile" opens a pop-up to change your photo (cropped square, 300 x 300 px) and bio (up to 150 characters). "Invite friends" opens the Friend List tab. Below is "My posts" with chips to show all posts or only one post type, 10 at a time. ☰ opens "Account settings": for now it shows your username and email, and only Log out works. The Mood tab shows your current mood and lets you pick a new one (see "Task 11 (follow-up) — Mood tab design"). Everything stays after closing the app.

**Files:**
- `app/(tabs)/profile.js`: the Profile tab: header, my posts, and the two pop-ups
- `app/(tabs)/_layout.js`: Profile has no default title bar (the design has its own top bar)
- `app/(tabs)/mood.js`: the Mood tab
- `src/features/profile/ProfileHeader.js`: everything above the posts
- `src/features/profile/MoodPill.js`: the "Feeling happy" pill
- `src/features/profile/ProfileStats.js`: the posts / friends / reactions boxes
- `src/features/profile/EditProfileModal.js`: the Edit profile pop-up
- `src/features/profile/AccountSettingsModal.js`: the Account settings pop-up
- `src/features/profile/useProfileStats.js`: loads the post and reaction numbers
- `src/features/profile/useProfilePhoto.js`: loads profile photos once and shows a new photo everywhere
- `src/features/profile/Avatar.js`: now shows the user's photo when they have one (initials otherwise)
- `src/features/profile/profileService.js`: saves the photo, bio and mood
- `src/features/posts/PostTypeFilter.js`: the All / post type chips
- `src/features/posts/PostList.js`: the list of post cards, shared by the For You feed and my posts
- `src/features/posts/ForYouFeed.js`: now just the shared list with all posts
- `src/features/posts/postService.js`, `usePaginatedPosts.js`: load one user's posts, optionally of one type, and count posts and reactions
- `src/features/posts/PostCard.js`, `PostAuthorMood.js`, `NewPostForm.js`, `src/features/comments/CommentItem.js`, `app/post/[id].js`: pass the photo to the avatars
- `src/components/AppModal.js`: the shared pop-up card with a title and ✕
- `src/utils/images.js`: makes a picked photo a small square for the profile
- `src/theme/colors.js`: the dimmed colour behind pop-ups
- `assets/images/`: the ☰, log out and dark share icons
- `firestore.rules`: profile photos, the photo flag, and authors updating the copies on their posts
- `firestore.indexes.json`: the two indexes for "my posts"

**Main functions / hooks / components:**
- `saveProfilePhoto`: saves the photo and turns `hasPhoto` on in one batch, together with `authorHasPhoto` on all the user's posts
- `saveBio`, `saveMood`: save the bio, and the current mood with its time
- `fetchAuthorStats`: reads a user's posts once, counts them and adds up their reactions (no extra index needed)
- `useProfileStats`: the numbers for the profile, loaded again after a refresh or a deleted post
- `useProfilePhoto`: returns a user's photo for an avatar; `rememberProfilePhoto` shows a new photo at once
- `prepareProfilePhoto`: crops the photo square, makes it 300 x 300 px and small enough
- `PostList`: the post list with pages, pull to refresh, a post type filter, and loading, empty and error states
- `AppModal`: the pop-up card used by Edit profile and Account settings

**Firestore:** reads and writes `users/{uid}` (bio, mood, moodUpdatedAt, hasPhoto) and `profileImages/{uid}`; reads `posts` where `authorId` is the user (and `postType` when filtered), newest first; reads all of them once to count them and add up their `reactionCounts`; updates `authorHasPhoto` on the user's posts.

**Firebase console steps:**
- Publish the new `firestore.rules` in Firestore Database → Rules.
- Create two composite indexes on the `posts` collection (Firestore Database → Indexes → Create index):
  - `authorId` Ascending, `createdAt` Descending (my posts)
  - `authorId` Ascending, `postType` Ascending, `createdAt` Descending (my posts of one type)

**How to test:**
1. Log in and open Profile. It shows your @username, avatar, name, mood pill, bio and the numbers. Only your posts are listed, newest first, and more load when you scroll.
2. Tap a post type chip: only posts of that type show. A type you never used says "You have no … posts yet." Tap All to see everything.
3. Tap Edit profile, change the photo and bio, and tap Save. The pop-up closes and the new photo and bio show at once, also on your posts and comments.
4. Tap the mood pill: the Mood tab opens. Pick another mood, tap "Set as my mood", go back: the pill and avatar ring changed.
5. Tap Invite friends: the Friend List tab opens.
6. Delete one of your posts: the posts and reactions numbers go down.
7. Tap ☰: Account settings shows your username and email; tap Log out and you are back on Home.
8. Close and reopen the app: photo, bio and mood are still there.

**Notes / limits:**
- The big name is the display name, which is the username (there is no full-name field). Post cards still show @username only (team decision).
- "friends" shows 0 until the friends tasks (13 and 14).
- Share does nothing (look only, team decision).
- Account settings: the username, email and password fields only show the current values; changing them comes in Task 16. The hint says 6 characters (the team kept 6, the mockup says 8).
- A profile photo can be changed but not removed (not in the plan).
- Other people's new photos show after reopening the app; your own shows at once.
- The current mood is just one mood: no history or chart (out of scope).

### Task 11 (follow-up) — Mood tab design

**What it does:** The Mood tab is built from the designer's mockup. At the top: "My mood" and "Your friends see this on your profile and in their friend list." A card shows "Right now you're feeling", your current mood with its emoji, and when you set it ("Updated 2 hours ago"); with no mood it says "No mood set" and "Pick a mood below". Under "How are you feeling?" the 6 moods are shown as cards, 3 per row, with your current mood highlighted. Tapping a card only picks it; the button at the bottom then says "Set as my mood" and saves it. While the picked mood is already your current mood, the button is grey and says "This is your current mood" ("Pick a mood" when you have none).

**Files:**
- `app/(tabs)/mood.js`: the Mood tab: header, current mood card, mood grid and the save button
- `app/(tabs)/_layout.js`: Mood has no default title bar (the design has its own header)
- `src/features/profile/CurrentMood.js`: the "Right now you're feeling" card
- `src/features/profile/MoodPicker.js`: the grid of the 6 mood cards
- `src/features/profile/MoodEmojiCircle.js`: a mood's emoji in a circle of the mood's colour
- `src/utils/time.js`: `formatTimeAgo` for "Updated 2 hours ago"

**Main functions / hooks / components:**
- `CurrentMood`: shows the current mood, or "No mood set"
- `MoodPicker`: the 6 mood cards; the selected one gets the mood's tint and border
- `formatTimeAgo`: turns a time into "just now", "5 minutes ago", "2 hours ago", "yesterday", "3 days ago" or "on 12 Nov"
- `saveMood` (from Task 11): saves the mood and the time it was set

**Firestore:** updates `mood` and `moodUpdatedAt` on `users/{uid}` (already allowed by the Task 11 rules).

**Firebase console steps:** none. The rules and indexes don't change.

**How to test:**
1. Open the Mood tab. The card shows your current mood and when you set it; that mood's card is highlighted and the button is grey ("This is your current mood").
2. Tap another mood. It is highlighted, and the button turns purple: "Set as my mood". Nothing is saved yet.
3. Tap the button. The top card shows the new mood, "Updated just now", and the button turns grey again.
4. Open Profile: the mood pill and the avatar ring show the new mood.
5. With an account that never set a mood, the card says "No mood set" and the button says "Pick a mood".

**Notes / limits:**
- A mood can be changed but not cleared (there is no "No mood" option on this page).
- Only the current mood is kept: no history (out of scope).
- Accounts that set a mood before this change may have no saved time; then the "Updated" line is hidden.

### Task 12 — Public profiles

**What it does:** Tapping a username or avatar on a post card, on the post page or in the comments opens that person's profile. It uses the same design as the Profile tab, read-only: a back button, their @username, avatar with mood ring, name, mood pill (it can't be tapped), bio, the posts / friends / reactions numbers, and their posts with the post type chips, 10 at a time. There is no Edit profile, Invite friends or ☰. Anyone can open it, also when logged out. Opening your own profile goes to the Profile tab.

**Files:**
- `app/user/[uid].js`: the public profile page, with loading, error and "This user doesn't exist." states
- `src/features/profile/ProfileHeader.js`: now also has a read-only look (`isOwnProfile` false): back button, no buttons, "Posts" instead of "My posts"
- `src/features/profile/MoodPill.js`: can be read-only (no tap)
- `src/features/profile/useUserProfile.js`: loads one user's profile
- `src/features/profile/openUserProfile.js`: opens a user's profile page
- `src/features/profile/profileService.js`: `fetchProfile` reads one profile
- `src/features/posts/PostCard.js`, `src/features/comments/CommentItem.js`: the avatar and the name open the profile
- `src/features/posts/PostCard.js`, `PostList.js`, `app/(tabs)/profile.js`: post cards say "felt sad when posting" (the mood when the post was written), and their avatar shows the author's current mood
- `src/features/posts/authorMoods.js`, `usePaginatedPosts.js`, `usePost.js`: load the authors' current moods for the feed and the post page

**Main functions / hooks / components:**
- `fetchProfile`: reads one user's profile, or null if the user doesn't exist
- `useUserProfile`: the profile for the page, with loading and error
- `openUserProfile`: opens `/user/{uid}`
- `ProfileHeader` with `isOwnProfile`: one design for your own and other people's profiles

**Firestore:** reads `users/{uid}`, `profileImages/{uid}` and that user's `posts` (the same queries as "my posts").

**Firebase console steps:** none. The rules already let anyone read profiles and posts, and the two indexes from Task 11 cover these lists.

**How to test:**
1. Logged out, on Home, tap someone's avatar or @username: their profile opens, with their posts only. There is no Edit profile, Invite friends or ☰, and the mood pill does nothing.
2. Tap a post type chip: only that type shows. Tap the back button: you are back on Home.
3. Log in, open a post page, tap a commenter's name or avatar: their profile opens.
4. Tap your own avatar or name anywhere: the Profile tab opens.
5. On someone's profile you can react to and open their posts, but there is no "•••" delete menu.
6. A post written while sad says "felt sad when posting" everywhere, while its avatar ring shows the author's current mood (in the feed, on the post page and on profiles).

**Notes / limits:**
- "friends" shows 0 until Tasks 13 and 14.
- The friend list will open profiles too, when it is built (Task 14).
- Share is look only (team decision).
- Two moods on a post card (team decision 2026-11-25): the text always says the mood when posting ("felt sad when posting"), and the avatar ring shows the author's current mood everywhere. The feed reads each author's profile once per page for this (a few extra reads). If that fails, the ring shows the mood when posting.
- The page is loaded once when opened; a change the user makes later shows after opening it again.
