# Installation

Create base models and validators from [prisma](https://github.com/prisma/prisma) schema

```bash
pnpm add @aomex/prisma
```

# Tested engines

- mysql
- postgresql
- mongodb
- sqlite

# Generator

1. Inject to File `prisma/schema.prisma`

```diff
datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

+ generator aomex {
+   provider = "aomex-prisma"
+ }

model user {
  id    Int  @id @default(autoincrement())
  name  String
  age   Int?
}

```

2. Execute in terminal

```bash
npx prisma generate
```

3. See output

```typescript
// File: node_modules/@aomex/prisma/dist/index.js
export class BaseModel {
  constructor(db) {
    this.db = db;
  }
}
export class BaseUserModel extends BaseModel {
  static fields = {
    id: rule.int(),
    name: rule.string(),
    age: rule.int().nullable(),
  };

  name = 'user';
  table = this.db.user;
  fields = BaseUserModel.fields;
}

// File: node_modules/@aomex/prisma/dist/index.d.ts
export declare abstract class BaseModel {
  protected readonly db: PrismaClient;
  constructor(db: PrismaClient);
}
export declare abstract class BaseUserModel extends BaseModel {
  fields: {
    id: IntValidator<number>;
    name: StringValidator<string>;
    age: IntValidator<number | null>;
  };

  readonly name = 'user';
  readonly table: Prisma.userDelegate<
    Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined
  >;
  readonly fields: BaseUserModel['fields'];
}
```

# Combine models

```typescript
import { BaseUserModel, combineModels } from '@aomex/prisma';
import { PrismaClient } from '@prisma/client';

// File: models/user.model.ts
class UserModel extends BaseUserModel {
  async getList() {
    return this.table.findMany({});
  }
  // ...Your own business
}

// FIle: models/index.ts
export const db = new PrismaClient();
export const models = combineModels(db, {
  user: UserModel,
});
```

# Validators

```typescript
import { pick, omit } from 'lodash-es';

// IntValidator<number>
const ruleId = models.user.fields.id;
// { id: IntValidator<number>; name: StringValidator<string> }
const sub1 = pick(models.user.fields, 'id', 'name');
// { id: IntValidator<number>; age: IntValidator<number | null>; }
const sub2 = omit(models.user.fields, 'name');
```
