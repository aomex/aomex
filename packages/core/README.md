# @aomex/core

aomex核心应用

## middleware

中间件，上层应用可扩展

```typescript
import { middleware } from '@aomex/core';

export const md = middleware.mixin(async (ctx, next) => {
  // ...
  return next();
});
```

## validator

验证器，验证一切输入

```typescript
import { rules, validate } from '@aomex/core';

const untrusted = {
  id: '1',
  name: 'aomex',
  eval: 'delete table',
};

const trusted = await validate(untrusted, {
  id: rule.int(),
  name: rule.string(),
});
console.log(trusted); // { id: 1, name: 'aomex' }
```
