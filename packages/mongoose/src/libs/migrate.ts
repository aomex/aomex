import mongoose from 'mongoose';

interface Operation {
  (db: mongoose.mongo.Db, session: mongoose.mongo.ClientSession): Promise<any>;
}

/**
 * 迁移数据，因为开启了事务，所以任何操作都需要带上session，这样能保证出错时顺利回滚数据。
 *
 * 注意：集合和索引会根据models自动同步，无须写迁移逻辑。
 */
export const migrate = (opts: { up: Operation; down: Operation }) => {
  return new Migrate(opts.up, opts.down);
};

export class Migrate {
  constructor(
    public readonly up: Operation,
    public readonly down: Operation,
  ) {}
}
