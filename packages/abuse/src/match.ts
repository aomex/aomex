/**
 * 路径匹配：精确字符串、简单 glob（`*` / `**`）、或正则。
 * 正则会对 `pathname + search` 检测，便于捕获 query 中的探测特征。
 */
export function matchPath(
  pathname: string,
  search: string,
  matcher: string | RegExp,
): boolean {
  if (matcher instanceof RegExp) {
    return matcher.test(pathname + search);
  }

  if (!matcher.includes('*')) {
    return pathname === matcher;
  }

  const re = globToRegExp(matcher);
  return re.test(pathname);
}

/**
 * 任一路径匹配器命中即为 true。
 * `paths` 为 `undefined` 时视为不限路径；空数组不命中。
 */
export function matchAnyPath(
  pathname: string,
  search: string,
  paths?: readonly (string | RegExp)[],
): boolean {
  if (paths === undefined) return true;
  return paths.some((item) => matchPath(pathname, search, item));
}

/**
 * 匹配 HTTP 方法（忽略大小写）。
 * `methods` 为 `undefined` 或空数组时视为不限方法。
 */
export function matchMethod(method: string, methods?: readonly string[]): boolean {
  if (!methods?.length) return true;
  const upper = method.toUpperCase();
  return methods.some((item) => item.toUpperCase() === upper);
}

/**
 * 事件名匹配：精确字符串、简单 glob（`*` → 任意字符）、或正则。
 */
export function matchEvent(event: string, matcher: string | RegExp): boolean {
  if (matcher instanceof RegExp) {
    return matcher.test(event);
  }

  if (!matcher.includes('*')) {
    return event === matcher;
  }

  let pattern = '';
  for (let i = 0; i < matcher.length; i += 1) {
    const char = matcher[i]!;
    if (char === '*') {
      pattern += '.*';
      continue;
    }
    if (/[.+?^${}()|[\]\\]/.test(char)) {
      pattern += `\\${char}`;
      continue;
    }
    pattern += char;
  }
  return new RegExp(`^${pattern}$`).test(event);
}

/**
 * 任一事件匹配器命中即为 true。
 * `events` 为 `undefined` 时视为不限；空数组不命中。
 */
export function matchAnyEvent(
  event: string,
  events?: readonly (string | RegExp)[],
): boolean {
  if (events === undefined) return true;
  return events.some((item) => matchEvent(event, item));
}

function globToRegExp(glob: string): RegExp {
  let source = glob;
  let optionalDeep = false;
  if (source.endsWith('/**')) {
    source = source.slice(0, -3);
    optionalDeep = true;
  }

  let pattern = '';
  for (let i = 0; i < source.length; i += 1) {
    const char = source[i]!;
    if (char === '*') {
      if (source[i + 1] === '*') {
        pattern += '.*';
        i += 1;
      } else {
        pattern += '[^/]*';
      }
      continue;
    }
    if (/[.+?^${}()|[\]\\]/.test(char)) {
      pattern += `\\${char}`;
      continue;
    }
    pattern += char;
  }
  if (optionalDeep) pattern += '(?:/.*)?';
  return new RegExp(`^${pattern}$`);
}
