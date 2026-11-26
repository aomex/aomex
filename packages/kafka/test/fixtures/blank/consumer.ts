import { KafkaConsumer } from '../../../src';

export const consumer = new KafkaConsumer({ groupId: 'billing' });
