// Photo helpers: pick a photo, make it smaller and turn it into base64 text,
// so it can be saved in a Firestore document (we have no Firebase Storage).
import { ImageManipulator, SaveFormat } from "expo-image-manipulator";
import { launchImageLibraryAsync } from "expo-image-picker";
import { PHOTO_TOO_BIG_CODE, PHOTO_TOO_DETAILED_CODE } from "./errors";

const MAX_PICKED_FILE_BYTES = 10 * 1024 * 1024; // "up to 10 MB" in the design
const POST_PHOTO_WIDTH = 800;
// A Firestore document can hold at most 1 MiB, so the photo text must stay
// under this (the same limit is in firestore.rules).
export const MAX_POST_PHOTO_CHARACTERS = 900000;
// Tried one after the other until the photo is small enough.
const COMPRESS_LEVELS = [0.7, 0.5, 0.3];

// Returns an error with one of our own photo error codes.
function createPhotoError(code) {
  const error = new Error(code);
  error.code = code;
  return error;
}

// Opens the photo library and lets the user crop the photo they pick.
// Returns the picked photo ({ uri, width, fileSize }), or null if the user
// closed the library. Throws if the file is over 10 MB.
export async function pickPhoto() {
  const result = await launchImageLibraryAsync({
    mediaTypes: ["images"],
    allowsEditing: true,
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

  // Save with stronger compression each time until the text is small enough.
  for (const compress of COMPRESS_LEVELS) {
    const saved = await image.saveAsync({
      compress,
      format: SaveFormat.JPEG,
      base64: true,
    });
    if (saved.base64.length <= MAX_POST_PHOTO_CHARACTERS) {
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
