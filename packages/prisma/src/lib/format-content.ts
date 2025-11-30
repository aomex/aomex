import prettier from 'prettier';

export const formatContent = async (content: string) => {
  let configuration: prettier.Options | null;
  try {
    configuration = await prettier.resolveConfig(import.meta.filename);
  } catch {
    configuration = null;
  }

  return prettier.format(content, {
    ...configuration,
    parser: 'typescript',
  });
};
