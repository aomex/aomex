import { TestConsoleApp } from '../../src/testing';
import { type TypeEqual, expectType } from 'ts-expect';
import { ConsoleInput } from '../../src';
const app = new TestConsoleApp({});
const input = new ConsoleInput(app, ['foo', 'bar']);

const options = input.parseArgv();
expectType<TypeEqual<Record<string, unknown>, typeof options>>(true);

const command = input.command;
expectType<TypeEqual<string, typeof command>>(true);
