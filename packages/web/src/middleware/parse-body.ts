import { middleware } from '@aomex/common';
import type { WebMiddleware } from '../override';
import formidable from 'formidable';
import coBody from 'co-body';

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
      const form = formidable({
        hashAlgorithm: 'md5',
        keepExtensions: true,
        maxFileSize: 1000 * 1024 * 1024,
        allowEmptyFiles: true,
      });

      const [fields, files] = await form.parse(request);
      const fixedFields = Object.fromEntries(
        Object.entries(fields).map(([key, values]) => {
          return [key, values == undefined || values.length > 1 ? values : values[0]];
        }),
      );
      request['_body'] = { ...fixedFields, ...files };
    }

    return next();
  });
};
