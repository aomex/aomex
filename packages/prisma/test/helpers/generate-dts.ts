// typescript 是核心包 `@aomex/common` 的 peerDependencies，因此用户一定会安装
import ts from 'typescript';
import { pascalCase } from '../../src/lib/pascal-case';
import path from 'path';
import { formatContent } from '../../src/lib/format-content';

const ruleMapping: Record<string, string> = {
  bigint: 'BigIntValidator',
};

export const generateDTS = (source: string) => {
  let content: string = '';

  {
    // Make sure dts can be generated successfully while package published.
    const imports = new Set<string>(['Validator']);
    const matchImports = source.matchAll(/rule\.(.+?)\(/gm);
    for (const matched of matchImports) {
      const shortName = matched[1]!;
      imports.add(ruleMapping[shortName] || pascalCase(shortName) + 'Validator');
    }
    source += `\nimport type { ${Array.from(imports).sort().join(',')} } from "@aomex/common";`;
  }

  {
    const tsFile = path
      .join(import.meta.dirname, `.${Date.now() + Math.random()}.temp.ts`)
      .replaceAll(path.sep, path.posix.sep);
    const options: ts.CompilerOptions = {
      strict: true,
      declaration: true,
      emitDeclarationOnly: true,
      strictNullChecks: true,
      skipLibCheck: true, // speed up,
      skipDefaultLibCheck: true,
      moduleResolution: ts.ModuleResolutionKind.Bundler,
    };
    const host = ts.createCompilerHost(options);
    const originReadFile = host.readFile.bind(host);
    host.readFile = (filename) => {
      return filename === tsFile ? source : originReadFile(filename);
    };
    host.writeFile = (_, c) => {
      content = c;
    };
    ts.createProgram([tsFile], options, host).emit();
  }

  return formatContent(content.replaceAll(/(export\sdeclare\s)/gm, '\n$1'));
};
