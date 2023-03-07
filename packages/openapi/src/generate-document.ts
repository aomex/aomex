import EventEmitter from 'node:events';
import type { Mode } from 'node:fs';
import { readPackageUp } from 'read-pkg-up';
import { Chain, OpenAPI } from '@aomex/core';
import { bytes, chalk, sleep } from '@aomex/utility';
import {
  fileToModules,
  type PathToFileOptions,
  pathToFiles,
} from '@aomex/file-parser';
import { WebMiddleware } from '@aomex/web';
import { Router } from '@aomex/web-router';
import validate from 'ibm-openapi-validator';
import path from 'node:path';
import { mkdir, writeFile } from 'node:fs/promises';
import yaml from 'yaml';

export interface OpenapiValidateResultItem {
  path: string[];
  message: string;
  rule: string;
}

export interface OpenapiValidateResult {
  errors: OpenapiValidateResultItem[];
  warnings: OpenapiValidateResultItem[];
}

export interface OpenapiOptions {
  /**
   * Web api routers
   */
  routers: PathToFileOptions;
  /**
   * Openapi basic information
   * @see OpenApiDocs
   */
  docs?: Omit<OpenAPI.Document, 'paths' | 'openapi' | 'info'> & {
    openapi?: `3.0.${0 | 1 | 2 | 3}`;
    info?: Partial<OpenAPI.Document['info']>;
  };
  /**
   * Save document to specific file (`*.yaml`|`*.json`). Defaults `openapi.json`
   */
  output?: false | string;
  /**
   * File mode. Defaults according system
   * @see OpenapiOptions.output
   */
  fileMode?: Mode;
  /**
   * Format JSON document to human readable. Defaults `false`
   */
  prettyJson?: boolean;
  /**
   * Fix the document by hand after the full document is generated
   */
  fix?: (data: OpenAPI.Document) => void;
  /**
   * Log emitter
   */
  emitter: EventEmitter;
}

export const generateDocument = async (
  config: OpenapiOptions,
): Promise<{
  document: OpenAPI.Document;
  result: OpenapiValidateResult;
}> => {
  const emitter = config.emitter || new EventEmitter();
  let msg = '';

  emitter.emit('start');
  emitter.emit('msg', 'Initialize');
  const document: OpenAPI.Document = JSON.parse(
    JSON.stringify(config.docs || {}),
  );

  {
    document.openapi ||= '3.0.3';
    document.tags ||= [];
    document.paths = {};
    document.info.title ||=
      (await readPackageUp())?.packageJson.name || 'API documentation';
    document.info.version ||=
      (await readPackageUp())?.packageJson.version || '0.0.0';
  }

  emitter.emit('msg', (msg = 'Search routers'));
  const files = await pathToFiles(config.routers);
  emitter.emit('msg', (msg = 'Parse router'));
  const usedTags: string[] = [];
  for (const file of files) {
    emitter.emit('replace', msg + path.relative(process.cwd(), file));
    await sleep(50);

    const routers = await fileToModules<Router>(
      [file],
      (item) => !!item && item instanceof Router,
    );
    for (const router of routers) {
      const groupMiddlewareList = Chain.flatten(Router.getChain(router));
      const builders = Router.getBuilders(router);

      for (const builder of builders) {
        for (const uri of builder.uris) {
          const pathItem = (document.paths[normalizePath(uri)] ||= {});
          let methods = builder.methods;

          if (methods.includes('GET') && methods.includes('HEAD')) {
            methods = methods.filter((method) => method !== 'HEAD');
          }

          for (const method of methods) {
            const methodItem: OpenAPI.OperationObject = (pathItem[
              method.toLowerCase() as `${Lowercase<typeof method>}`
            ] = {
              tags: [getTagByFilename(file)],
              responses: {},
              ...builder.docs,
            });

            for (const middleware of groupMiddlewareList.concat(
              Chain.flatten(builder.chain),
            )) {
              if (middleware instanceof WebMiddleware) {
                middleware.toDocument({
                  document,
                  pathItem,
                  methodItem,
                });
              }
            }

            if (Object.keys(methodItem.responses).length === 0) {
              methodItem.responses = {
                default: {
                  description: '',
                },
              };
            }

            usedTags.push(...methodItem.tags!);
          }
        }
      }
    }
  }
  emitter.emit('replace', msg);

  {
    emitter.emit('msg', (msg = 'Fix document by hand'));
    if (config.fix) {
      config.fix(document);
    } else {
      emitter.emit('replace', skip(msg));
    }
  }

  {
    emitter.emit('msg', (msg = 'Optimize document'));
    const tagDefinitions = document.tags!.filter(({ name: tag }) =>
      usedTags.includes(tag),
    );
    const definedTags = tagDefinitions.map((item) => item.name);
    [...new Set(usedTags)].sort().forEach((tag) => {
      if (!definedTags.includes(tag)) {
        tagDefinitions.push({
          name: tag,
        });
      }
    });
    document.tags = tagDefinitions;
  }

  {
    emitter.emit('msg', (msg = 'Save to file'));
    let distFile: typeof config.output =
      config.output === false ? false : config.output || 'openapi.json';
    if (distFile) {
      distFile = path.resolve(distFile);
      await mkdir(path.dirname(distFile), {
        recursive: true,
      });

      const content = ['.yml', '.yaml'].includes(path.extname(distFile))
        ? yaml.stringify(document)
        : JSON.stringify(document, null, config.prettyJson ? 2 : undefined);

      await writeFile(distFile, content, {
        mode: config.fileMode,
      });
      emitter.emit(
        'replace',
        msg +
          path.relative(process.cwd(), distFile) +
          ' ' +
          bytes(Buffer.byteLength(content), { unitSeparator: '' }),
        true,
      );
    } else {
      emitter.emit('replace', skip(msg));
    }
  }

  emitter.emit('msg', (msg = 'Validate'));
  const result = (await validate(document)) as OpenapiValidateResult;

  {
    const summary: string[] = [];
    if (result.errors?.length) {
      summary.push(`${result.errors.length} errors`);
    }
    if (result.warnings?.length) {
      summary.push(`${result.warnings.length} warnings`);
    }
    summary.length &&
      emitter.emit('replace', msg + chalk.yellow(summary.join('，')));

    emitter.emit(
      'end',
      result.errors?.length ? 'fail' : result.warnings?.length ? 'warn' : 'ok',
    );
  }

  return {
    document: JSON.parse(JSON.stringify(document)),
    result: {
      errors: result.errors || [],
      warnings: result.warnings || [],
    },
  };
};

const skip = (message: string) => message + ' ' + chalk.gray('[skipped]');

const normalizePath = (uri: string) => {
  return uri.replace(/:([a-z0-9_?]+)/gi, (_, $1) => {
    return `{${$1.replace(/[?]/g, '')}}`;
  });
};

const getTagByFilename = (file: string) => {
  return path.basename(file).replace(/\..+$/, '');
};
