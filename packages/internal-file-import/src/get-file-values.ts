export const getFileValues = async <T extends unknown>(
  files: string[],
  filterValues?: (item?: unknown) => boolean,
): Promise<T[]> => {
  const totalFiles = new Set<T>();
  await Promise.all(
    files.map(async (file) => {
      const modules = await import(file);
      if (typeof modules === 'object') {
        Object.values(modules).forEach((item) => {
          totalFiles.add(item as any);
        });
      }
    }),
  );
  return filterValues ? [...totalFiles].filter(filterValues) : [...totalFiles];
};
