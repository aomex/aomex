import { CacheMemoryAdapter } from '@aomex/cache/memory';
import { expect, test } from 'vitest';
import { Abuse } from '../src';

const abuse = new Abuse({ store: new CacheMemoryAdapter(), strategies: [] });
const matchPath = abuse['matchPath'].bind(abuse);
const matchAnyPath = abuse['matchAnyPath'].bind(abuse);
const matchMethod = abuse['matchMethod'].bind(abuse);
const matchEvent = abuse['matchEvent'].bind(abuse);
const matchAnyEvent = abuse['matchAnyEvent'].bind(abuse);

test('精确路径：完全相等才命中', () => {
  expect(matchPath('/.env', '', '/.env')).toBe(true);
  expect(matchPath('/.env', '?leak=1', '/.env')).toBe(true);
  expect(matchPath('/admin', '', '/.env')).toBe(false);
  // 近邻路径不误伤
  expect(matchPath('/.env.local', '', '/.env')).toBe(false);
  expect(matchPath('/.env.bak', '', '/.env')).toBe(false);
  expect(matchPath('/.environment', '', '/.env')).toBe(false);
  expect(matchPath('/.env/', '', '/.env')).toBe(false);
  expect(matchPath('/.ENV', '', '/.env')).toBe(false);
  expect(matchPath('//.env', '', '/.env')).toBe(false);
  expect(matchPath('/.env ', '', '/.env')).toBe(false);
  expect(matchPath('/.env\0', '', '/.env')).toBe(false);
});

test('精确路径：常见探针与合法路径区分', () => {
  expect(matchPath('/.git', '', '/.git')).toBe(true);
  expect(matchPath('/.github', '', '/.git')).toBe(false);
  expect(matchPath('/.gitignore', '', '/.git')).toBe(false);
  expect(matchPath('/admin', '', '/admin')).toBe(true);
  expect(matchPath('/administrator', '', '/admin')).toBe(false);
  expect(matchPath('/admin.php', '', '/admin')).toBe(false);
  expect(matchPath('/wp-admin', '', '/admin')).toBe(false);
  expect(matchPath('/', '', '/')).toBe(true);
  expect(matchPath('/index', '', '/')).toBe(false);
});

test('glob：`*` 不跨目录，`**` 可跨段', () => {
  expect(matchPath('/wp-admin.php', '', '/wp-*.php')).toBe(true);
  expect(matchPath('/wp-login.php', '', '/wp-*.php')).toBe(true);
  expect(matchPath('/wp/admin.php', '', '/wp-*.php')).toBe(false);
  expect(matchPath('/wp-admin/index.php', '', '/wp-*.php')).toBe(false);

  expect(matchPath('/a/b/c', '', '/a/*/c')).toBe(true);
  expect(matchPath('/a/b/d/c', '', '/a/*/c')).toBe(false);
  expect(matchPath('/a/b/d/c', '', '/a/**/c')).toBe(true);
  expect(matchPath('/a/x/y/c', '', '/a/**/c')).toBe(true);
  // `/a/**/c` 展开为 `/a/.*/c`，中间的 `/` 字面量要求至少多一段，故不命中 `/a/c`
  expect(matchPath('/a/c', '', '/a/**/c')).toBe(false);
});

test('glob：末尾 `/**` 含自身与任意深层子路径', () => {
  expect(matchPath('/.git', '', '/.git/**')).toBe(true);
  expect(matchPath('/.git/config', '', '/.git/**')).toBe(true);
  expect(matchPath('/.git/hooks/pre-commit', '', '/.git/**')).toBe(true);
  expect(matchPath('/.git/', '', '/.git/**')).toBe(true);
  // 近邻：.github / .gitignore 不应被 /.git/** 命中
  expect(matchPath('/.github', '', '/.git/**')).toBe(false);
  expect(matchPath('/.github/workflows', '', '/.git/**')).toBe(false);
  expect(matchPath('/.gitignore', '', '/.git/**')).toBe(false);
  expect(matchPath('/.gitmodules', '', '/.git/**')).toBe(false);
  expect(matchPath('/foo/.git/config', '', '/.git/**')).toBe(false);
});

test('glob：敏感文件扩展与备份名', () => {
  expect(matchPath('/.env', '', '/.env*')).toBe(true);
  expect(matchPath('/.env.local', '', '/.env*')).toBe(true);
  expect(matchPath('/.env.production', '', '/.env*')).toBe(true);
  expect(matchPath('/.env.bak', '', '/.env*')).toBe(true);
  expect(matchPath('/.env.old', '', '**/.env*')).toBe(true);
  expect(matchPath('/config/.env.old', '', '**/.env*')).toBe(true);
  expect(matchPath('/backup.sql', '', '**/*.{sql,bak,zip}')).toBe(false); // 花括号按字面量转义，非扩展语法
  expect(matchPath('/backup.sql', '', '**/*.sql')).toBe(true);
  expect(matchPath('/dump.bak', '', '**/*.bak')).toBe(true);
  expect(matchPath('/var/www/backup.zip', '', '**/*.zip')).toBe(true);
});

test('glob：字面量特殊字符需按字面匹配，不按正则语义', () => {
  expect(matchPath('/file.json', '', '/file.json')).toBe(true);
  expect(matchPath('/fileXjson', '', '/file.json')).toBe(false); // `.` 被转义
  expect(matchPath('/a+b', '', '/a+b')).toBe(true);
  expect(matchPath('/ab', '', '/a+b')).toBe(false);
  expect(matchPath('/a?b', '', '/a?b')).toBe(true);
  expect(matchPath('/ab', '', '/a?b')).toBe(false);
  expect(matchPath('/a(b)', '', '/a(b)')).toBe(true);
  expect(matchPath('/ab', '', '/a(b)')).toBe(false);
  expect(matchPath('/a|b', '', '/a|b')).toBe(true);
  expect(matchPath('/a', '', '/a|b')).toBe(false);
  expect(matchPath('/[id]', '', '/[id]')).toBe(true);
  expect(matchPath('/i', '', '/[id]')).toBe(false);
  expect(matchPath('/price$/', '', '/price$/')).toBe(true);
  expect(matchPath('/price', '', '/price$/')).toBe(false);
});

test('glob：仅匹配 pathname，忽略 search', () => {
  expect(matchPath('/.env', '?file=../../etc/passwd', '/.env*')).toBe(true);
  expect(matchPath('/safe', '?file=../../etc/passwd', '/.env*')).toBe(false);
  expect(matchPath('/api', '?x=../etc', '/api*')).toBe(true);
  expect(matchPath('/api/v1', '?x=1', '/api*')).toBe(false); // `*` 不跨 `/`
});

test('glob：常见扫描器路径模式', () => {
  const patterns = [
    '/.env*',
    '/.git/**',
    '/.aws/**',
    '/wp-*.php',
    '/xmlrpc.php',
    '/phpmyadmin/**',
    '/actuator/**',
    '**/.DS_Store',
    '**/web.config',
    '**/composer.json',
    '**/package-lock.json',
  ] as const;

  expect(matchAnyPath('/.env.staging', '', patterns)).toBe(true);
  expect(matchAnyPath('/.git/HEAD', '', patterns)).toBe(true);
  expect(matchAnyPath('/.aws/credentials', '', patterns)).toBe(true);
  expect(matchAnyPath('/wp-login.php', '', patterns)).toBe(true);
  expect(matchAnyPath('/xmlrpc.php', '', patterns)).toBe(true);
  expect(matchAnyPath('/phpmyadmin/index.php', '', patterns)).toBe(true);
  expect(matchAnyPath('/actuator/env', '', patterns)).toBe(true);
  expect(matchAnyPath('/static/.DS_Store', '', patterns)).toBe(true);
  expect(matchAnyPath('/app/web.config', '', patterns)).toBe(true);
  expect(matchAnyPath('/vendor/composer.json', '', patterns)).toBe(true);
  expect(matchAnyPath('/frontend/package-lock.json', '', patterns)).toBe(true);

  // 正常业务路径不应误伤
  expect(matchAnyPath('/api/users', '', patterns)).toBe(false);
  expect(matchAnyPath('/health', '', patterns)).toBe(false);
  expect(matchAnyPath('/packages/list', '', patterns)).toBe(false);
  expect(matchAnyPath('/.github/workflows/ci.yml', '', patterns)).toBe(false);
});

test('正则匹配 pathname+search，便于抓 query 探测', () => {
  expect(matchPath('/api', '?x=../etc', /\.\./)).toBe(true);
  expect(matchPath('/api', '?x=1', /\.\./)).toBe(false);
  expect(matchPath('/download', '?file=../../etc/passwd', /\.\.(\/|%2f)/i)).toBe(true);
  expect(matchPath('/download', '?file=%2e%2e%2fetc%2fpasswd', /%2e%2e/i)).toBe(true);
  expect(matchPath('/search', '?q=<script>', /<script/i)).toBe(true);
  expect(matchPath('/search', '?q=1+OR+1%3D1', /or\s+1\s*=\s*1/i)).toBe(false); // 未解码空格
  expect(matchPath('/search', '?q=1 OR 1=1', /or\s+1\s*=\s*1/i)).toBe(true);
  expect(matchPath('/etc/passwd', '', /etc\/passwd/)).toBe(true);
  expect(matchPath('/ok', '', /etc\/passwd/)).toBe(false);
  // 空 search 时仍只测 pathname
  expect(matchPath('/.env', '', /\.env/)).toBe(true);
  expect(matchPath('/api', '', /\?/)).toBe(false);
  expect(matchPath('/api', '?a=1', /\?/)).toBe(true);
});

test('正则：大小写 / 锚定 / 拼接边界', () => {
  expect(matchPath('/Admin', '', /admin/i)).toBe(true);
  expect(matchPath('/Admin', '', /admin/)).toBe(false);
  expect(matchPath('/api', '?admin=1', /^\/api$/)).toBe(false); // 拼接后含 search，整串锚定失败
  expect(matchPath('/api', '', /^\/api$/)).toBe(true);
  expect(matchPath('/api', '?x=1', /^\/api\?/)).toBe(true);
  // pathname 末尾与 search 开头拼接，避免误用未锚定片段
  expect(matchPath('/foo', '?bar=1', /o\?b/)).toBe(true); // '...o' + '?b...'
});

test('matchAnyPath 任一命中；混用精确 / glob / 正则', () => {
  expect(matchAnyPath('/.env', '', ['/.git', '/.env'])).toBe(true);
  expect(matchAnyPath('/ok', '', ['/.env', '/admin'])).toBe(false);
  expect(matchAnyPath('/api', '?x=../etc', [/\.\./])).toBe(true);
  expect(matchAnyPath('/.git/config', '', ['/admin', '/.git/**', /\.\./])).toBe(true);
  expect(matchAnyPath('/safe', '?x=../etc', ['/admin', '/.git/**', /\.\./])).toBe(true);
  expect(matchAnyPath('/safe', '?x=1', ['/admin', '/.git/**', /\.\./])).toBe(false);
});

test('matchAnyPath 未配置 paths 时不限路径，空数组不命中', () => {
  expect(matchAnyPath('/any', '')).toBe(true);
  expect(matchAnyPath('/any', '', undefined)).toBe(true);
  expect(matchAnyPath('/any', '', [])).toBe(false);
});

test('路径穿越与双斜杠等变形：精确/glob 不做归一化', () => {
  expect(matchPath('/../.env', '', '/.env')).toBe(false);
  expect(matchPath('/foo/../.env', '', '/.env')).toBe(false);
  expect(matchPath('/foo/../.env', '', '**/.env')).toBe(true); // 字面段匹配
  expect(matchPath('//.env', '', '/.env')).toBe(false);
  expect(matchPath('//.env', '', '//.env')).toBe(true);
  expect(matchPath('/./.env', '', '/.env')).toBe(false);
  expect(matchPath('/%2e%2e/.env', '', '/.env')).toBe(false);
  expect(matchPath('/%2e%2e/.env', '', /%2e%2e/i)).toBe(true);
});

test('方法匹配忽略大小写', () => {
  expect(matchMethod('GET', ['get', 'POST'])).toBe(true);
  expect(matchMethod('Post', ['GET', 'post'])).toBe(true);
  expect(matchMethod('TRACE', ['GET'])).toBe(false);
  expect(matchMethod('OPTIONS', ['options'])).toBe(true);
  expect(matchMethod('PROPFIND', ['propfind', 'GET'])).toBe(true);
});

test('methods 未配置或空数组时不限方法', () => {
  expect(matchMethod('GET')).toBe(true);
  expect(matchMethod('GET', undefined)).toBe(true);
  expect(matchMethod('TRACE', [])).toBe(true);
  expect(matchMethod('WEIRD', [])).toBe(true);
});

test('事件：精确匹配', () => {
  expect(matchEvent('admin.destroy', 'admin.destroy')).toBe(true);
  expect(matchEvent('admin.destroy', 'admin.delete')).toBe(false);
  expect(matchEvent('admin', 'admin.destroy')).toBe(false);
});

test('事件：glob 与正则', () => {
  expect(matchEvent('admin.destroy', 'admin.*')).toBe(true);
  expect(matchEvent('admin.destroy.all', 'admin.*')).toBe(true);
  expect(matchEvent('user.destroy', 'admin.*')).toBe(false);
  expect(matchEvent('admin.destroy', /^admin\./)).toBe(true);
  expect(matchEvent('chat.send', /^admin\./)).toBe(false);
  // `.` 按字面量
  expect(matchEvent('adminXdestroy', 'admin.destroy')).toBe(false);
});

test('事件：matchAnyEvent', () => {
  expect(matchAnyEvent('ping')).toBe(true);
  expect(matchAnyEvent('ping', undefined)).toBe(true);
  expect(matchAnyEvent('ping', [])).toBe(false);
  expect(matchAnyEvent('admin.destroy', ['chat.send', 'admin.*'])).toBe(true);
  expect(matchAnyEvent('pong', ['ping', /^chat\./])).toBe(false);
});
