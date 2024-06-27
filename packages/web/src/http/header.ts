export type HeaderKeys = UpperHeaderKeys | LowerHeaderKeys;
export type UpperHeaderKeys = UpperArrayHeaderKeys | UpperStringHeaderKeys;
export type LowerHeaderKeys = LowerArrayHeaderKeys | LowerStringHeaderKeys;

export type LowerArrayHeaderKeys = 'set-cookie';
export type UpperArrayHeaderKeys = 'Set-Cookie';
export type ArrayHeaderKeys = LowerArrayHeaderKeys | UpperArrayHeaderKeys;

export type StringHeaderKeys = LowerStringHeaderKeys | UpperStringHeaderKeys;

export type LowerStringHeaderKeys =
  | LowerExternalStringHeaderKeys
  | LowerOfficialStringHeaderKeys;

export type UpperStringHeaderKeys =
  | UpperExternalStringHeaderKeys
  | UpperOfficialStringHeaderKeys;

export type LowerExternalStringHeaderKeys =
  | 'accept-encoding'
  | 'x-forwarded-for'
  | 'x-forwarded-proto'
  | 'x-forwarded-host'
  | 'x-real-ip'
  | 'access-control-request-private-network'
  | 'access-control-allow-private-network'
  | ':authority';
export type UpperExternalStringHeaderKeys =
  | 'Accept-Encoding'
  | 'X-Forwarded-For'
  | 'X-Forwarded-Proto'
  | 'X-Forwarded-Host'
  | 'X-Real-IP'
  | 'Access-Control-Request-Private-Network'
  | 'Access-Control-Allow-Private-Network';

export type LowerOfficialStringHeaderKeys =
  | 'accept'
  | 'accept-language'
  | 'accept-patch'
  | 'accept-ranges'
  | 'access-control-allow-credentials'
  | 'access-control-allow-headers'
  | 'access-control-allow-methods'
  | 'access-control-allow-origin'
  | 'access-control-expose-headers'
  | 'access-control-max-age'
  | 'access-control-request-headers'
  | 'access-control-request-method'
  | 'age'
  | 'allow'
  | 'alt-svc'
  | 'authorization'
  | 'cache-control'
  | 'connection'
  | 'content-disposition'
  | 'content-encoding'
  | 'content-language'
  | 'content-length'
  | 'content-location'
  | 'content-range'
  | 'content-type'
  | 'cookie'
  | 'date'
  | 'etag'
  | 'expect'
  | 'expires'
  | 'forwarded'
  | 'from'
  | 'host'
  | 'if-match'
  | 'if-modified-since'
  | 'if-none-match'
  | 'if-unmodified-since'
  | 'last-modified'
  | 'location'
  | 'origin'
  | 'pragma'
  | 'proxy-authenticate'
  | 'proxy-authorization'
  | 'public-key-pins'
  | 'range'
  | 'referer'
  | 'retry-after'
  | 'sec-websocket-accept'
  | 'sec-websocket-extensions'
  | 'sec-websocket-key'
  | 'sec-websocket-protocol'
  | 'sec-websocket-version'
  | 'strict-transport-security'
  | 'tk'
  | 'trailer'
  | 'transfer-encoding'
  | 'upgrade'
  | 'user-agent'
  | 'vary'
  | 'via'
  | 'warning'
  | 'www-authenticate';
export type UpperOfficialStringHeaderKeys =
  | 'Accept'
  | 'Accept-Language'
  | 'Accept-Patch'
  | 'Accept-Ranges'
  | 'Access-Control-Allow-Credentials'
  | 'Access-Control-Allow-Headers'
  | 'Access-Control-Allow-Methods'
  | 'Access-Control-Allow-Origin'
  | 'Access-Control-Expose-Headers'
  | 'Access-Control-Max-Age'
  | 'Access-Control-Request-Headers'
  | 'Access-Control-Request-Method'
  | 'Age'
  | 'Allow'
  | 'Alt-Svc'
  | 'Authorization'
  | 'Cache-Control'
  | 'Connection'
  | 'Content-Disposition'
  | 'Content-Encoding'
  | 'Content-Language'
  | 'Content-Length'
  | 'Content-Location'
  | 'Content-Range'
  | 'Content-Type'
  | 'Cookie'
  | 'Date'
  | 'Etag'
  | 'Expect'
  | 'Expires'
  | 'Forwarded'
  | 'From'
  | 'Host'
  | 'If-Match'
  | 'If-Modified-Since'
  | 'If-None-Match'
  | 'If-Unmodified-Since'
  | 'Last-Modified'
  | 'Location'
  | 'Origin'
  | 'Pragma'
  | 'Proxy-Authenticate'
  | 'Proxy-Authorization'
  | 'Public-Key-Pins'
  | 'Range'
  | 'Referer'
  | 'Retry-After'
  | 'Sec-Websocket-Accept'
  | 'Sec-Websocket-Extensions'
  | 'Sec-Websocket-Key'
  | 'Sec-Websocket-Protocol'
  | 'Sec-Websocket-Version'
  | 'Strict-Transport-Security'
  | 'Tk'
  | 'Trailer'
  | 'Transfer-Encoding'
  | 'Upgrade'
  | 'User-Agent'
  | 'Vary'
  | 'Via'
  | 'Warning'
  | 'WWW-Authenticate';
