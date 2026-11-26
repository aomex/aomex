import { rule } from '@aomex/common';
import { defineKafkaTopic, KafkaConsumer } from '../../../src';

export const userRegisteredTopic = defineKafkaTopic(
  'user.registered',
  rule.object({
    userId: rule.string(),
  }),
);

export const consumer = new KafkaConsumer({ groupId: 'billing' });
consumer.on(userRegisteredTopic, { action: () => {} });
