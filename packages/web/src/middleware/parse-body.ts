import { middleware, sleep } from '@aomex/common';
import type { WebMiddleware } from '../override';
import formidable from 'formidable';
import coBody from 'co-body';
import { unlink } from 'node:fs/promises';

const jsonTypes = <const>['json', 'application/*+json', 'application/csp-report'];
const formTypes = <const>['urlencoded'];
const textTypes = <const>['text'];

export const parseBody = (): WebMiddleware => {
  return middleware.web(async (ctx, next) => {
    const { request } = ctx;
    if (!request.contentType) return next();

    const methodName = request.matchContentType(...jsonTypes)
      ? 'json'
      : request.matchContentType(...formTypes)
        ? 'form'
        : request.matchContentType(...textTypes)
          ? 'text'
          : false;

    if (methodName) {
      const { parsed, raw } = await coBody[methodName](request, {
        // 默认值：1mb for json and 56kb for form-urlencoded
        limit: '32mb',
        returnRawBody: true,
        // @ts-expect-error
        onProtoPoisoning: 'remove',
      });
      request['_body'] = parsed;
      request['_rawBody'] = raw;
    } else if (request.matchContentType('multipart/*')) {
      const filepaths: string[] = [];
      const form = formidable({
        hashAlgorithm: 'md5',
        keepExtensions: true,
        maxFileSize: 100 * 1024 * 1024,
        maxFiles: 30,
        // 禁止0字节空文件
        allowEmptyFiles: false,
      });
      form.on('fileBegin', (_name, file) => {
        filepaths.push(file.filepath);
      });

      const cleanupFiles = () => {
        for (const filepath of filepaths) {
          // formidable 可能仍握有写流，首次 unlink 会 EBUSY；短重试覆盖 close 前后窗口
          void (async () => {
            for (let i = 0; i < 5; i++) {
              try {
                await unlink(filepath);
                return;
              } catch (e) {
                const code =
                  e && typeof e === 'object' && 'code' in e
                    ? (e as NodeJS.ErrnoException).code
                    : undefined;
                if (code === 'ENOENT') return;
                // Windows 上文件占用常见为 EPERM
                if (code !== 'EBUSY' && code !== 'EPERM') return;
                await sleep(20 * (i + 1));
              }
            }
          })();
        }
      };

      // 兜底：客户端中途断连且 form.parse 未 reject 时，仍能清已落盘临时文件。
      // 正常读完 body 也会触发 close，故仅在 !complete 时删除。
      const onRequestCloseDuringParse = () => {
        if (!request.complete) cleanupFiles();
      };
      request.once('close', onRequestCloseDuringParse);

      try {
        const [fields, files] = await form.parse(request);
        request.off('close', onRequestCloseDuringParse);

        const fixedFields = Object.fromEntries(
          Object.entries(fields).map(([key, values]) => {
            return [key, values == undefined || values.length > 1 ? values : values[0]];
          }),
        );
        request['_body'] = { ...fixedFields, ...files };

        if (filepaths.length) {
          let cleaned = false;
          const cleanup = () => {
            if (cleaned) return;
            cleaned = true;
            cleanupFiles();
          };
          ctx.response.once('finish', cleanup);
          ctx.response.once('close', cleanup);
        }
      } catch (e) {
        // fileBegin 触发 error 后 formidable 仍可能继续 open 写流，close 时再清一次
        cleanupFiles();
        request.once('close', cleanupFiles);
        throw e;
      }
    }

    return next();
  });
};
