// Hook that loads a user's profile photo. All avatars of the same user share
// one download, and a newly saved photo shows on all of them at once.
import { useEffect, useState } from "react";
import { fetchProfilePhoto } from "./profileService";

// Photos already loaded (user ID → data URI), photos being loaded right now
// (user ID → its download), and the avatars showing each user's photo (user
// ID → the functions that update them).
const loadedPhotos = new Map();
const loadingPhotos = new Map();
const photoListeners = new Map();

// Takes a user ID and returns their photo, downloading it only the first time.
function loadProfilePhoto(uid) {
  if (loadedPhotos.has(uid)) return Promise.resolve(loadedPhotos.get(uid));
  if (!loadingPhotos.has(uid)) {
    const download = fetchProfilePhoto(uid)
      .then((photoUri) => {
        if (photoUri) loadedPhotos.set(uid, photoUri);
        return photoUri;
      })
      .finally(() => loadingPhotos.delete(uid));
    loadingPhotos.set(uid, download);
  }
  return loadingPhotos.get(uid);
}

// Takes a user ID and their new photo (a data URI), keeps it, and shows it on
// every avatar of that user. Called after the user saves a new photo.
export function rememberProfilePhoto(uid, photoUri) {
  loadedPhotos.set(uid, photoUri);
  photoListeners.get(uid)?.forEach((setPhotoUri) => setPhotoUri(photoUri));
}

// Takes a user ID and whether they have a photo. Returns the photo as a data
// URI, or null (no photo, still loading, or it couldn't be loaded).
export default function useProfilePhoto(uid, hasPhoto) {
  const canShowPhoto = Boolean(uid && hasPhoto);
  const [photoUri, setPhotoUri] = useState(
    canShowPhoto ? (loadedPhotos.get(uid) ?? null) : null,
  );

  // Loads the photo, and keeps listening for a new one while the avatar is
  // on screen.
  useEffect(() => {
    if (!canShowPhoto) return undefined;
    let isCurrent = true;
    const listeners = photoListeners.get(uid) ?? new Set();
    photoListeners.set(uid, listeners);
    listeners.add(setPhotoUri);

    loadProfilePhoto(uid)
      .then((loadedUri) => {
        if (isCurrent && loadedUri) setPhotoUri(loadedUri);
      })
      .catch(() => {});

    return () => {
      isCurrent = false;
      listeners.delete(setPhotoUri);
    };
  }, [uid, canShowPhoto]);

  return canShowPhoto ? photoUri : null;
}
