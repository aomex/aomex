import type { Options } from 'tsup';
import c from '../../tsup.config';

const config = c as Options;

(config.entry! as string[]).push('src/bin.ts');
config.splitting = false;
(config.external ||= []).push('typescript');

export default config;
