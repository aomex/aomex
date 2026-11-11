import { Service } from '../../src/service.js';

export class NamedOnlyService extends Service {
  ping() {
    return 'named-only';
  }
}
