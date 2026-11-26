import { rule } from '@aomex/common';
import { defineKafkaTopic, KafkaConsumer } from '../../../src';

const orderCreatedTopic = defineKafkaTopic(
  'order.created',
  rule.object({ orderId: rule.string() }),
);

export const consumer = new KafkaConsumer({ groupId: 'notify' });
consumer.on(orderCreatedTopic, { action: () => {} });
