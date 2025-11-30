import ts from 'typescript';
import { formatContent } from '../../src/lib/format-content';

export const generateJS = (source: string) => {
  const content = ts.transpileModule(source, {
    compilerOptions: {
      target: ts.ScriptTarget.ES2022,
      module: ts.ModuleKind.ES2022,
      importHelpers: false,
      sourceMap: false,
      declaration: false,
    },
  }).outputText;
  return formatContent(
    content.replaceAll(/^(export\sconst\s|class\s|export class\s)/gm, '\n$1'),
  );
};
