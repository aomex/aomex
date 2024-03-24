# @aomex/core

aomex核心应用

## middleware

中间件，上层应用可扩展

```typescript
import { middleware } from '@aomex/core';

export const mdw = middleware.mixin((ctx, next) => {
  return next();
});
```

## container

中间件容器，上层应用可扩展

```typescript
import { container } from '@aomex/core';

export const myContainer = container.mixin.mount(mdw);
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
