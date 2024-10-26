import type { Middleware } from '@aomex/common';
import { ConsoleMiddleware, type ConsoleDocument } from '../override/console-middleware';
import type { ConsoleApp } from '../cli';

export const collectConsoleDocument = async (data: {
  document: ConsoleDocument.Document;
  middlewareList: Middleware[];
  app: ConsoleApp;
}) => {
  const { document, middlewareList, app } = data;

  const hooks: Record<string, Middleware[]> = {};
  const onDocumentLoop = async (middlewareList: Middleware[]) => {
    const injectors = middlewareList.map((middleware) => {
      return middleware instanceof ConsoleMiddleware ? middleware['help']() : {};
    });
    await Promise.all(
      injectors.map((injector) => {
        return injector.onDocument?.(document, {
          app,
          children: onDocumentLoop,
          collectCommand(commandName, middlewareList) {
            hooks[commandName] = middlewareList;
          },
        });
      }),
    );
  };

  await onDocumentLoop(middlewareList);

  const onDocumentItemLoop = async (
    commandName: string,
    middlewareList: Middleware[],
  ) => {
    if (!commandName || !document[commandName]) return;

    const injectors = middlewareList.map((middleware) => {
      return middleware instanceof ConsoleMiddleware ? middleware['help']() : {};
    });
    await Promise.all(
      injectors.map((injector) => {
        return injector.onCommandItem?.(document[commandName]!, {
          commandName,
          doc: document,
          app,
          children: onDocumentItemLoop.bind(null, commandName),
        });
      }),
    );
  };

  await Promise.all(
    Object.entries(hooks).map(([commandName, middlewareList]) => {
      return onDocumentItemLoop(commandName, middlewareList);
    }),
  );

  const postDocumentItemLoop = async (
    commandName: string,
    middlewareList: Middleware[],
  ) => {
    if (!commandName || !document[commandName]) return;

    const injectors = [...middlewareList].reverse().map((middleware) => {
      return middleware instanceof ConsoleMiddleware ? middleware['help']() : {};
    });
    await Promise.all(
      injectors.map((injector) => {
        return injector.postCommandItem?.(document[commandName]!, {
          commandName,
          doc: document,
          app,
          children: postDocumentItemLoop.bind(null, commandName),
        });
      }),
    );
  };

  await Promise.all(
    Object.entries(hooks).map(([commandName, middlewareList]) => {
      return postDocumentItemLoop(commandName, middlewareList);
    }),
  );

  const postDocumentLoop = async (middlewareList: Middleware[]) => {
    const injectors = [...middlewareList].reverse().map((middleware) => {
      return middleware instanceof ConsoleMiddleware ? middleware['help']() : {};
    });
    await Promise.all(
      injectors.map((injector) => {
        return injector.postDocument?.(document, { app, children: postDocumentLoop });
      }),
    );
  };

  await postDocumentLoop(middlewareList);

  return document;
};
