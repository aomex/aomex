import { join } from 'path';
import { defineConfig } from 'prisma/config';

export default defineConfig({
  schema: join(import.meta.dirname, 'table-name.prisma'),
  datasource: {
    url: 'DATABASE_URL',
  },
});
