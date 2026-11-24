import type { OpenAPI } from '@aomex/common';
import { methods } from './methods';

/**
 * 同一个路径下，所有方法都有相同的parameter时，可以往上提取，这样能减小生成产物
 */
export const methodParameterToPathParameter = (document: OpenAPI.Document) => {
  pathLoop: for (const path of Object.values(document.paths)) {
    const parametersHandler: Record<string, Function[]> = {};
    let methodCounter = 0;
    for (const method of methods) {
      const methodItem = path![method];
      if (!methodItem) continue;
      if (!methodItem.parameters?.length) continue pathLoop;
      ++methodCounter;
      methodItem.parameters.forEach((parameter, index, arr) => {
        const uniqueKey = JSON.stringify(parameter);
        // 确保是唯一的
        parameter = arr[index] = JSON.parse(uniqueKey);
        const handler = () => {
          arr.splice(
            arr.findIndex((item) => item === parameter),
            1,
          );
          if (!arr.length) {
            delete methodItem.parameters;
          }
        };
        parametersHandler[uniqueKey] ||= [];
        parametersHandler[uniqueKey]!.push(handler);
      });
    }

    if (methodCounter < 2) continue pathLoop;

    Object.entries(parametersHandler).forEach(([uniqueKey, handlers]) => {
      if (handlers.length !== methodCounter) return;
      path!.parameters ||= [];
      path!.parameters.push(JSON.parse(uniqueKey));
      handlers.forEach((fn) => fn());
    });
    if (path!.parameters && !path!.parameters.length) {
      delete path!.parameters;
    }
  }
};
