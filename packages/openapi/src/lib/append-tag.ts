import type { OpenAPI } from '@aomex/core';

export const appendTag = (document: OpenAPI.Document, usedTags: string[]) => {
  const tags = (document.tags ||= []);
  const definedTags = tags.map((item) => item.name);
  const undefinedTags = usedTags.filter((tag) => !definedTags.includes(tag)).sort();

  for (const tag of undefinedTags) {
    tags.push({ name: tag });
  }

  return undefinedTags;
};
