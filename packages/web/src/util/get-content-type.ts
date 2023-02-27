import mimeTypes from 'mime-types';
import LRU from 'lru-cache';

const cache = new LRU<string, string | false>({
  max: 100,
});

export const getMimeType = (filenameOrExt: string): string | false => {
  let mimeType: string | false | undefined = cache.get(filenameOrExt);

  if (!mimeType) {
    mimeType = mimeTypes.contentType(filenameOrExt);
    cache.set(filenameOrExt, mimeType);
  }

  return mimeType;
};
