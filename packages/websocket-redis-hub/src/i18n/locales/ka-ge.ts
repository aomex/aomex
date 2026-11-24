import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** ka-GE */
export default I18n.satisfies(zh).define({
  hub_closed: 'RedisHub დახურულია, ტრანსლაცია შეუძლებელია',
  resync_failed: 'Redis-ის გამოწერების აღდგენა ვერ მოხერხდა',
  sync_room_failed: 'ოთახის გამოწერის გასწორება ვერ მოხერხდა: {{room}}',
  bus_fanout_failed: 'არხზე გავრცელება ვერ მოხერხდა',
  destroy_ready_failed: 'გათიშვისას Hub-ის ინიციალიზაციის ლოდინი ვერ მოხერხდა',
});
