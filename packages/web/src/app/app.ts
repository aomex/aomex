import { createServer, RequestListener, Server } from 'node:http';
import EventEmitter from 'node:events';
import { EOL } from 'node:os';
import { Chain, compose } from '@aomex/core';
import { chalk } from '@aomex/utility';
import type { HttpError } from 'http-errors';
import type { IParseOptions } from 'qs';
import { WebContext } from '../app/context';
import type { WebMiddlewareToken } from '../override/chain';
import { WebRequest } from './request';
import { WebResponse } from './response';
import type { CookieParseOptions, CookieSerializeOptions } from 'cookie';

export interface WebAppOption {
  silent?: boolean;
  debug?: boolean;
  /**
   * Set default options for `qs` when parsing querystring from request
   * @see WebRequest.query
   */
  query?: IParseOptions;
  /**
   * Set default/common options for cookie
   */
  cookie?: {
    /**
     * Default option for request.cookie
     * @see WebRequest.cookie
     */
    get?: CookieParseOptions;
    /**
     * Default option for response.cookie
     * @see WebResponse.cookie
     */
    set?: CookieSerializeOptions;
  };
}

export class WebApp extends EventEmitter {
  public readonly chainPoints: string[] = [];
  protected readonly middlewareList: WebMiddlewareToken[] = [];

  constructor(readonly options: WebAppOption = {}) {
    super();
  }

  get debug(): boolean {
    return this.options.debug || false;
  }

  public listen: Server['listen'] = (...args: any[]) => {
    const server = createServer(
      {
        IncomingMessage: WebRequest,
        ServerResponse: WebResponse,
      },
      this.callback(),
    );
    return server.listen(...args);
  };

  public callback(): RequestListener<any, any> {
    const fn = compose(this.middlewareList);

    // At least one listener is required before emit.
    if (!this.listenerCount('error')) {
      this.on('error', this.log.bind(this));
    }

    return (req: WebRequest, res: WebResponse) => {
      return fn(new WebContext(this, req, res))
        .then(res.flush.bind(res))
        .catch(res.onError);
    };
  }

  public log(err: HttpError) {
    if (this.options.silent) return;
    if ((err.status || err.statusCode) === 404 || err.expose) return;
    const msgs = (err.stack || err.toString()).split(EOL, 2);
    console.error(
      ['', chalk.bgRed(msgs.shift()), msgs.join(EOL), ''].join(EOL),
    );
  }

  public override on(
    eventName: 'error',
    listener: (err: HttpError, ctx: WebContext) => void,
  ): this;
  public override on(
    eventName: string | symbol,
    listener: (...args: any[]) => void,
  ): this;
  public override on(
    eventName: string | symbol,
    listener: (...args: any[]) => void,
  ): this {
    return super.on(eventName, listener);
  }

  public mount(middleware: WebMiddlewareToken | null): void {
    if (middleware === null) return;
    if (middleware instanceof Chain) {
      this.chainPoints.push(Chain.createSplitPoint(middleware));
    }
    this.middlewareList.push(middleware);
  }
}
