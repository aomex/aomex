import { Service } from '../../src/service.js';

export class WithDefaultService extends Service {
  ping() {
    return 'with-default';
  }
}

export default WithDefaultService;
