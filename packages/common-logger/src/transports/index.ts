import { CustomTransport } from './custom-transport';
import { ConsoleTransport } from './console-transport';
import { FileTransport } from './file-transport';

export const transports = <const>{
  File: FileTransport,
  Console: ConsoleTransport,
  Custom: CustomTransport,
};
