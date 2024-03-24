# @aomex/service

项目服务层

# 初始化

```bash
pnpm add @aomex/service
```

# 使用方式

### 创建服务

```typescript
// File: src/services/my.service.ts
import { Service } from '@aomex/service';

export class MyService extends Service {
  protected override async init() {
    // 做一些初始化操作
  }

  action1() {
    return 'ok';
  }

  async action2() {
    // 使用其他服务
    await this.services.other.actionX();
    ...
  }
}
```

### 服务组合

```typescript
// File: src/services/index.ts
import { combineServices } from '@aomex/service';

export const services = await combineServices({
  my: MyService,
});

// 服务中可以安全地使用`this.services`
declare module '@aomex/service' {
  type T = typeof services;
  export interface CombinedServices extends T {}
}
```

### 使用服务

```typescript
import { services } from '../services';

services.my.action1();
```
