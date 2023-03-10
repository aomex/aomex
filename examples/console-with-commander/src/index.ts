import { ConsoleApp } from '@aomex/console';
import { commanders } from '../../../packages/commander/src';
import { appChain } from './middleware/chain';

const app = new ConsoleApp();

app.mount(appChain);
app.mount(commanders('./src/commanders'));

await app.run();
