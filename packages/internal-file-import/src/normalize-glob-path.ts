export interface GlobPathFullOptions {
  pattern: string[];
  ignore?: string[];
  dot?: boolean;
}

export type GlobPathOptions =
  | string
  | string[]
  | GlobPathFullOptions
  | GlobPathFullOptions[];

export const normalizeGlobPath = (paths: GlobPathOptions): GlobPathFullOptions[] => {
  if (typeof paths === 'string') {
    return [{ pattern: [paths] }];
  }

  if (Array.isArray(paths)) {
    if (!paths.length) return [];
    return isStringArray(paths) ? [{ pattern: paths }] : paths;
  }

  return [paths];
};

const isStringArray = (data: string[] | GlobPathFullOptions[]): data is string[] => {
  return typeof data[0] === 'string';
};
