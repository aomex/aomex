import {
  pathToFiles,
  getFileValues,
  type GlobPathOptions,
} from '@aomex/internal-file-import';
import { Channel } from '@aomex/websocket';

/** 把 glob 或已实例化的 `Channel[]` 收成 Channel 列表。不从包入口导出。 */
export const resolveChannels = async (
  options: GlobPathOptions | Channel[],
): Promise<Channel[]> => {
  if (isChannelList(options)) return options;
  const files = await pathToFiles(options);
  return getFileValues<Channel>(files, (item) => !!item && item instanceof Channel);
};

export const isChannelList = (
  options: GlobPathOptions | Channel[],
): options is Channel[] => {
  if (!Array.isArray(options)) return false;
  if (options.length === 0) return true;
  return options[0] instanceof Channel;
};
