// TypeScript 7 不再提供 Compiler API，测试辅助改用兼容包
import ts from '@typescript/typescript6';
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
      // Buffer 等 Node 全局类型依赖 @types/node；缺省时会塌成 any
      types: ['node'],
    };
    const host = ts.createCompilerHost(options);
    const originReadFile = host.readFile.bind(host);
    host.readFile = (filename) => {
      return filename === tsFile ? source : originReadFile(filename);
    };
    host.writeFile = (_, c) => {
      content = c;
    };
    const program = ts.createProgram([tsFile], options, host);
    const diagnostics = ts
      .getPreEmitDiagnostics(program)
      .filter((d) => d.category === ts.DiagnosticCategory.Error);
    if (diagnostics.length) {
      const message = diagnostics
        .map((d) => ts.flattenDiagnosticMessageText(d.messageText, '\n'))
        .join('\n');
      throw new Error(`generateDTS failed:\n${message}`);
    }
    program.emit();
  }

  return formatContent(content.replaceAll(/(export\sdeclare\s)/gm, '\n$1'));
};
