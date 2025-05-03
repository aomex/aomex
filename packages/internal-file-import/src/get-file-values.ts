import { pathToFileURL } from 'node:url';

export const getFileValues = async <T extends unknown>(
  files: string[],
  filterValues?: (item?: unknown) => boolean,
): Promise<T[]> => {
  const totalFiles = new Set<T>();
  await Promise.all(
    files.map(async (file) => {
      // Error [ERR_UNSUPPORTED_ESM_URL_SCHEME]: Only URLs with a scheme in: file, data, and node are supported by the default ESM loader. On Windows, absolute paths must be valid file:// URLs. Received protocol 'c:'
      const modules = await import(pathToFileURL(file).toString());
      if (typeof modules === 'object') {
        Object.values(modules).forEach((item) => {
          totalFiles.add(item as any);
        });
      }
    }),
  );
  return filterValues ? [...totalFiles].filter(filterValues) : [...totalFiles];
};
