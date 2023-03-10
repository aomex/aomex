import { pathToFileURL } from 'node:url';

export const fileToModules = async <T extends unknown>(
  files: string[],
  filter?: (item?: T) => boolean,
): Promise<T[]> => {
  const result = await Promise.all(
    files.map(async (file) => {
      const modules = await import(pathToFileURL(file).toString());
      return typeof modules === 'object' ? Object.values(modules) : [];
    }),
  );
  const modules = [...new Set(result.flat() as T[])];
  return filter ? modules.filter(filter) : modules;
};
