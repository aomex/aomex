import type { DMMF } from '@prisma/generator-helper';
import { expect, test } from 'vitest';
import { parseFields } from '../src/lib/parse-fields';

const stringField = (documentation: string): DMMF.Field =>
  ({
    name: 'note',
    kind: 'scalar',
    isList: false,
    isRequired: true,
    isUnique: false,
    isId: false,
    isReadOnly: false,
    hasDefaultValue: false,
    type: 'String',
    isGenerated: false,
    isUpdatedAt: false,
    documentation,
  }) as DMMF.Field;

const parseNote = (documentation: string) => {
  const lines = parseFields([stringField(documentation)], true);
  const comment = lines.find((line) => line.includes('/**'));
  const fieldLine = lines.find((line) => line.startsWith('note:'));
  return { comment, fieldLine, joined: lines.join('\n') };
};

test.each([
  ['双引号', 'say "hi"'],
  ['反斜杠', 'path\\to\\file'],
  ['换行', 'line1\nline2'],
  ['CRLF', 'line1\r\nline2'],
  ['单引号', "it's fine"],
  ['反引号', 'use `code` here'],
  ['模板字面量形态', 'value is ${user.name}'],
  ['块注释终止符', 'oops */ broken'],
  ['嵌套块注释开头', 'see /** nested'],
  ['混杂破坏序列', 'a "b" \\ c\nd */ e `f` ${g}'],
])('documentation %# %s 经 stringify 写入 docs，且不弄坏注释块', (_label, docs) => {
  const { comment, fieldLine, joined } = parseNote(docs);

  expect(fieldLine).toContain(`.docs({ description: ${JSON.stringify(docs)} })`);

  expect(comment).toBeTruthy();
  expect(joined).toMatch(/\/\*\*[\s\S]*?\*\//);

  // 注释体内不得出现未转义的 */，否则会提前闭合
  const body = joined.match(/\/\*\*([\s\S]*?)\*\//)?.[1] ?? '';
  expect(body).not.toContain('*/');

  // 含换行的文档应逐行带 JSDoc 前缀，避免落到注释外
  if (docs.includes('\n') || docs.includes('\r')) {
    for (const line of docs.split(/\r?\n/)) {
      expect(comment).toContain(` * ${line.replaceAll('*/', '*\\/')}`);
    }
  }
});

test('字符串默认值含 */ 时不会弄坏注释块', () => {
  const lines = parseFields(
    [
      {
        name: 'note',
        kind: 'scalar',
        isList: false,
        isRequired: true,
        isUnique: false,
        isId: false,
        isReadOnly: false,
        hasDefaultValue: true,
        default: 'oops */ broken',
        type: 'String',
        isGenerated: false,
        isUpdatedAt: false,
      } as DMMF.Field,
    ],
    true,
  );
  const joined = lines.join('\n');
  const body = joined.match(/\/\*\*([\s\S]*?)\*\//)?.[1] ?? '';

  expect(body).not.toContain('*/');
  expect(joined).toContain('数据库默认值：`"oops *\\/ broken"`');
});
