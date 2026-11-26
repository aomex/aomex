import { rule } from '@aomex/common';
import { defineKafkaTopic, KafkaConsumer } from '../../../src';

export const orderCreatedTopic = defineKafkaTopic(
  'order.created',
  rule.object({
    orderId: rule.string(),
  }),
);

export const consumer = new KafkaConsumer({ groupId: 'billing' });
consumer.on(orderCreatedTopic, { action: () => {} });

export const note = 'skip';
