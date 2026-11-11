import { Service } from '../../src/service.js';

export class MultiAService extends Service {
  ping() {
    return 'a';
  }
}

export class MultiBService extends Service {
  ping() {
    return 'b';
  }
}
