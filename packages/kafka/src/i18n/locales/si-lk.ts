import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** si-LK */
export default I18n.satisfies(zh).define({
  empty_brokers: 'brokers හිස් විය නොහැක',
  empty_broker: 'brokers හි හිස් ලිපිනයක් ඇත',
  empty_client_id: 'clientId හිස් විය නොහැක',
  empty_group_id: 'groupId හිස් විය නොහැක',
  empty_topic: 'මාතෘකා නාමය හිස් විය නොහැක',
  invalid_topic_name: 'වලංගු නොවන මාතෘකා නාමය: {{topic}}',
  topic_name_too_long: 'මාතෘකා නාමය ඉතා දිගුය: {{length}} > {{max}}',
  duplicate_topic: 'මාතෘකාව එක වරකට වඩා ලියාපදිංචි කර ඇත: {{topic}}',
  mixed_group_id: 'එක් consume ඇමතුමකට groupId එකක් පමණක් තිබිය හැක',
  empty_consumers: 'Kafka පාරිභෝගිකයන් හමු නොවීය',
  already_consuming: 'පාරිභෝගිකයෙකු දැනටමත් ධාවනය වේ',
  closed: 'Kafka සම්බන්ධතාව වසා ඇත',
  message_too_large: 'පණිවිඩ ප්‍රමාණය සීමාව ඉක්මවයි: {{bytes}} > {{max}}',
  invalid_json: 'පණිවිඩය වලංගු JSON නොවේ',
  empty_message: 'පණිවිඩ ශරීරය හිස්ය',
  encode_failed: 'පණිවිඩය JSON ලෙස කේතනය කළ නොහැකි විය',
  unknown_topic: 'දායක නොවූ මාතෘකාවක් ලැබුණි: {{topic}}',
  invalid_offset: 'වලංගු නොවන පණිවිඩ ඕෆ්සෙට්: {{offset}}',
  idempotent_requires_all_acks: 'idempotent producer සක්‍රිය විට acks -1 විය යුතුය',
  unsupported_sasl: 'සහාය නොදක්වන SASL යාන්ත්‍රණය: {{mechanism}}',
  unsupported_tls: 'TLS විකල්පය සේවාදායකයාට ලබා දිය නොහැක: {{name}}',
  heartbeat_exceeds_session: 'හෘද ස්පන්දන පරතරය සැසි කාල සීමාවට වඩා කුඩා විය යුතුය',
});
