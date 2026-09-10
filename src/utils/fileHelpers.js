// src/utils/fileHelpers.js

export const API_ORIGIN = 'http://localhost:5003';

// Keep this in sync with FileUploadService._allowedExtensions on the backend
export const ALLOWED_FILE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.pdf', '.doc', '.docx'];
export const ACCEPTED_FILE_TYPES = ALLOWED_FILE_EXTENSIONS.join(',');

const IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png', 'gif', 'webp'];

/**
 * Turns a relative backend path (e.g. "/uploads/ProductImages/xyz.pdf")
 * into a full absolute URL. Leaves absolute URLs untouched.
 */
export const resolveFileUrl = (fileUrl) => {
  if (!fileUrl) return null;
  if (fileUrl.startsWith('http://') || fileUrl.startsWith('https://')) return fileUrl;
  return `${API_ORIGIN}${fileUrl.startsWith('/') ? '' : '/'}${fileUrl}`;
};

/**
 * Extracts a lowercase extension (without the dot) from a file name or URL.
 */
export const getFileExtension = (nameOrUrl) => {
  if (!nameOrUrl) return '';
  const clean = nameOrUrl.split('?')[0].split('#')[0];
  const parts = clean.split('.');
  return parts.length > 1 ? parts.pop().toLowerCase() : '';
};

export const isImageExtension = (ext) => IMAGE_EXTENSIONS.includes((ext || '').toLowerCase());

export const isImageUrl = (url) => isImageExtension(getFileExtension(url));

/**
 * Pulls a human-friendly file name out of a stored URL
 * (e.g. "/uploads/ProductImages/guid.pdf" -> "guid.pdf").
 */
export const getFileNameFromUrl = (url) => {
  if (!url) return '';
  const last = url.split('/').pop();
  try {
    return decodeURIComponent(last);
  } catch {
    return last;
  }
};