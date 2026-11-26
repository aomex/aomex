import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** hy-AM */
export default I18n.satisfies(zh).define({
  empty_brokers: 'brokers-ը չի կարող դատարկ լինել',
  empty_broker: 'brokers-ը պարունակում է դատարկ հասցե',
  empty_client_id: 'clientId-ը չի կարող դատարկ լինել',
  empty_group_id: 'groupId-ը չի կարող դատարկ լինել',
  empty_topic: 'Թեմայի անունը չի կարող դատարկ լինել',
  invalid_topic_name: 'Անվավեր թեմայի անուն՝ {{topic}}',
  topic_name_too_long: 'Թեմայի անունը չափազանց երկար է՝ {{length}} > {{max}}',
  duplicate_topic: 'Թեման գրանցված է մեկից ավելի անգամ՝ {{topic}}',
  mixed_group_id: 'Մեկ consume կանչում կարող է լինել միայն մեկ groupId',
  empty_consumers: 'Kafka սպառողներ չեն գտնվել',
  already_consuming: 'Սպառողն արդեն աշխատում է',
  closed: 'Kafka կապը փակ է',
  message_too_large: 'Հաղորդագրության չափը գերազանցում է սահմանը՝ {{bytes}} > {{max}}',
  invalid_json: 'Հաղորդագրությունը վավեր JSON չէ',
  empty_message: 'Հաղորդագրության մարմինը դատարկ է',
  encode_failed: 'Հաղորդագրությունը չհաջողվեց կոդավորել որպես JSON',
  unknown_topic: 'Ստացվել է չբաժանորդագրված թեմա՝ {{topic}}',
  invalid_offset: 'Անվավեր հաղորդագրության տեղաշարժ՝ {{offset}}',
  idempotent_requires_all_acks:
    'Իդեմպոտենտ պրոդյուսերը միացված լինելու դեպքում acks-ը պետք է լինի -1',
  unsupported_sasl: 'Չաջակցվող SASL մեխանիզմ՝ {{mechanism}}',
  unsupported_tls: 'TLS կարգավորումը չի կարող փոխանցվել հաճախորդին՝ {{name}}',
  heartbeat_exceeds_session:
    'Սրտազարկի միջակայքը պետք է լինի նիստի ժամանակի սահմանից փոքր',
});
