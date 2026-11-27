// Photo helpers: pick a photo, make it smaller and turn it into base64 text,
// so it can be saved in a Firestore document (we have no Firebase Storage).
import { ImageManipulator, SaveFormat } from "expo-image-manipulator";
import { launchImageLibraryAsync } from "expo-image-picker";
import { PHOTO_TOO_BIG_CODE, PHOTO_TOO_DETAILED_CODE } from "./errors";

const MAX_PICKED_FILE_BYTES = 10 * 1024 * 1024; // "up to 10 MB" in the design
const POST_PHOTO_WIDTH = 800;
// A Firestore document can hold at most 1 MiB, so the photo text must stay
// under this (the same limit is in firestore.rules).
const MAX_POST_PHOTO_CHARACTERS = 900000;
// Profile photos are small squares (the same limit is in firestore.rules).
const PROFILE_PHOTO_SIZE = 300;
const MAX_PROFILE_PHOTO_CHARACTERS = 300000;
// Tried one after the other until the photo is small enough.
const COMPRESS_LEVELS = [0.7, 0.5, 0.3];

// Returns an error with one of our own photo error codes.
function createPhotoError(code) {
  const error = new Error(code);
  error.code = code;
  return error;
}

// Opens the photo library and lets the user crop the photo they pick. With
// isSquare, the crop box is square (for profile photos). Returns the picked
// photo ({ uri, width, height, fileSize }), or null if the user closed the
// library. Throws if the file is over 10 MB.
export async function pickPhoto({ isSquare = false } = {}) {
  const result = await launchImageLibraryAsync({
    mediaTypes: ["images"],
    allowsEditing: true,
    aspect: isSquare ? [1, 1] : undefined,
    quality: 1,
  });
  if (result.canceled) return null;

  const photo = result.assets[0];
  if (photo.fileSize && photo.fileSize > MAX_PICKED_FILE_BYTES) {
    throw createPhotoError(PHOTO_TOO_BIG_CODE);
  }
  return photo;
}

// Takes a picked photo and makes it at most 800 px wide, as a JPEG that is
// small enough for Firestore. Returns { uri, width, height, base64 } (uri,
// width and height are for the preview). Throws if it can't be made small
// enough.
export async function preparePostPhoto(photo) {
  const editor = ImageManipulator.manipulate(photo.uri);
  if (photo.width > POST_PHOTO_WIDTH) {
    editor.resize({ width: POST_PHOTO_WIDTH });
  }
  const image = await editor.renderAsync();
  return saveAsSmallJpeg(image, MAX_POST_PHOTO_CHARACTERS);
}

// Takes a picked photo and makes it a 300 x 300 px square JPEG for a profile
// photo. The middle of the photo is kept if it isn't square yet (the web has
// no crop box). Returns { uri, width, height, base64 }.
export async function prepareProfilePhoto(photo) {
  const side = Math.min(photo.width, photo.height);
  const image = await ImageManipulator.manipulate(photo.uri)
    .crop({
      originX: Math.floor((photo.width - side) / 2),
      originY: Math.floor((photo.height - side) / 2),
      width: side,
      height: side,
    })
    .resize({ width: PROFILE_PHOTO_SIZE, height: PROFILE_PHOTO_SIZE })
    .renderAsync();
  return saveAsSmallJpeg(image, MAX_PROFILE_PHOTO_CHARACTERS);
}

// Saves an edited image as a JPEG, with stronger compression each time until
// its base64 text has at most maxCharacters. Returns { uri, width, height,
// base64 }. Throws if it can't be made small enough.
async function saveAsSmallJpeg(image, maxCharacters) {
  for (const compress of COMPRESS_LEVELS) {
    const saved = await image.saveAsync({
      compress,
      format: SaveFormat.JPEG,
      base64: true,
    });
    if (saved.base64.length <= maxCharacters) {
      return {
        uri: saved.uri,
        width: saved.width,
        height: saved.height,
        base64: saved.base64,
      };
    }
  }
  throw createPhotoError(PHOTO_TOO_DETAILED_CODE);
}
