import { type TypeEqual, expectType } from 'ts-expect';
import { ConsoleApp, ConsoleInput } from '../../src';

const app = new ConsoleApp();
const input = new ConsoleInput(app, ['foo', 'bar']);

const options = input.parseArgv();
expectType<TypeEqual<Record<string, unknown>, typeof options>>(true);

const command = input.command;
expectType<TypeEqual<string, typeof command>>(true);
