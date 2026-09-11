
export const API_ORIGIN = 'http://localhost:5003';

export const ALLOWED_FILE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.pdf', '.doc', '.docx'];
export const ACCEPTED_FILE_TYPES = ALLOWED_FILE_EXTENSIONS.join(',');

const IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png', 'gif', 'webp'];


export const resolveFileUrl = (fileUrl) => {
  if (!fileUrl) return null;
  if (fileUrl.startsWith('http://') || fileUrl.startsWith('https://')) return fileUrl;
  return `${API_ORIGIN}${fileUrl.startsWith('/') ? '' : '/'}${fileUrl}`;
};


export const getFileExtension = (nameOrUrl) => {
  if (!nameOrUrl) return '';
  const clean = nameOrUrl.split('?')[0].split('#')[0];
  const parts = clean.split('.');
  return parts.length > 1 ? parts.pop().toLowerCase() : '';
};

export const isImageExtension = (ext) => IMAGE_EXTENSIONS.includes((ext || '').toLowerCase());

export const isImageUrl = (url) => isImageExtension(getFileExtension(url));


export const getFileNameFromUrl = (url) => {
  if (!url) return '';
  const last = url.split('/').pop();
  try {
    return decodeURIComponent(last);
  } catch {
    return last;
  }
};