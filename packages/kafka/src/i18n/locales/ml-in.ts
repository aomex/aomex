import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** ml-IN */
export default I18n.satisfies(zh).define({
  empty_brokers: 'brokers ശൂന്യമായിരിക്കരുത്',
  empty_broker: 'brokers-ൽ ശൂന്യമായ വിലാസമുണ്ട്',
  empty_client_id: 'clientId ശൂന്യമായിരിക്കരുത്',
  empty_group_id: 'groupId ശൂന്യമായിരിക്കരുത്',
  empty_topic: 'വിഷയനാമം ശൂന്യമായിരിക്കരുത്',
  invalid_topic_name: 'അസാധുവായ വിഷയനാമം: {{topic}}',
  topic_name_too_long: 'വിഷയനാമം വളരെ നീളമുള്ളതാണ്: {{length}} > {{max}}',
  duplicate_topic: 'വിഷയം ഒന്നിലധികം തവണ രജിസ്റ്റർ ചെയ്തിട്ടുണ്ട്: {{topic}}',
  mixed_group_id: 'ഒരു consume കോളിൽ ഒരു groupId മാത്രമേ അനുവദിക്കൂ',
  empty_consumers: 'Kafka ഉപഭോക്താക്കളൊന്നും കണ്ടെത്തിയില്ല',
  already_consuming: 'ഒരു ഉപഭോക്താവ് ഇതിനകം പ്രവർത്തിക്കുന്നു',
  closed: 'Kafka കണക്ഷൻ അടച്ചിരിക്കുന്നു',
  message_too_large: 'സന്ദേശത്തിന്റെ വലിപ്പം പരിധി കവിയുന്നു: {{bytes}} > {{max}}',
  invalid_json: 'സന്ദേശം സാധുവായ JSON അല്ല',
  empty_message: 'സന്ദേശ ബോഡി ശൂന്യമാണ്',
  encode_failed: 'സന്ദേശം JSON ആയി എൻകോഡ് ചെയ്യാനായില്ല',
  unknown_topic: 'സബ്സ്ക്രൈബ് ചെയ്യാത്ത വിഷയം ലഭിച്ചു: {{topic}}',
  invalid_offset: 'അസാധുവായ സന്ദേശ ഓഫ്‌സെറ്റ്: {{offset}}',
  idempotent_requires_all_acks: 'ഐഡംപൊട്ടന്റ് പ്രൊഡ്യൂസർ ഓണാക്കിയിരിക്കുമ്പോൾ acks -1 ആയിരിക്കണം',
  unsupported_sasl: 'പിന്തുണയില്ലാത്ത SASL മെക്കാനിസം: {{mechanism}}',
  unsupported_tls: 'TLS ഓപ്ഷൻ ക്ലയന്റിലേക്ക് കൈമാറാനാവില്ല: {{name}}',
  heartbeat_exceeds_session: 'ഹാർട്ട്‌ബീറ്റ് ഇടവേള സെഷൻ ടൈംഔട്ടിനേക്കാൾ ചെറുതായിരിക്കണം',
});
