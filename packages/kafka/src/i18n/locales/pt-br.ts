import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** pt-BR */
export default I18n.satisfies(zh).define({
  empty_brokers: 'brokers não pode estar vazio',
  empty_broker: 'brokers contém um endereço vazio',
  empty_client_id: 'clientId não pode estar vazio',
  empty_group_id: 'groupId não pode estar vazio',
  empty_topic: 'O nome do tópico não pode estar vazio',
  invalid_topic_name: 'Nome de tópico inválido: {{topic}}',
  topic_name_too_long: 'O nome do tópico é muito longo: {{length}} > {{max}}',
  duplicate_topic: 'O tópico está registrado mais de uma vez: {{topic}}',
  mixed_group_id: 'Uma chamada de consumo só pode ter um groupId',
  empty_consumers: 'Nenhum consumidor Kafka encontrado',
  already_consuming: 'Já há um consumidor em execução',
  closed: 'A conexão Kafka está fechada',
  message_too_large: 'O tamanho da mensagem excede o limite: {{bytes}} > {{max}}',
  invalid_json: 'A mensagem não é um JSON válido',
  empty_message: 'O corpo da mensagem está vazio',
  encode_failed: 'Não foi possível codificar a mensagem como JSON',
  unknown_topic: 'Recebido um tópico não inscrito: {{topic}}',
  invalid_offset: 'Deslocamento de mensagem inválido: {{offset}}',
  idempotent_requires_all_acks: 'Com o produtor idempotente ativado, acks deve ser -1',
  unsupported_sasl: 'Mecanismo SASL não suportado: {{mechanism}}',
  unsupported_tls: 'A opção TLS não pode ser passada ao cliente: {{name}}',
  heartbeat_exceeds_session:
    'O intervalo de heartbeat deve ser menor que o tempo limite da sessão',
});
