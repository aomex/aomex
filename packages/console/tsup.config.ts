import type { Options } from 'tsup';
import config from '../../tsup.config';

((config as Options).entry! as string[]).push('src/bin.ts');
(config as Options).splitting = false;

export default config;
