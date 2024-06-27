import mimeTypes from 'mime-types';

const cache: Record<string, string> = {};

export const getMimeType = (filenameOrExt: string): string => {
  let mimeType = cache[filenameOrExt];
  if (mimeType === undefined) {
    mimeType = mimeTypes.contentType(filenameOrExt) || '';
    cache[filenameOrExt] = mimeType;
  }
  return mimeType;
};
