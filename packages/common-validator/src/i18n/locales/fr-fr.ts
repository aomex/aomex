import { I18n } from '@aomex/internal-tools';
import { zh } from './zh-cn';

/** fr-FR */
export default I18n.satisfies(zh).define({
  validator: {
    required: '{{label}} est requis',
    array: {
      must_be_array: '{{label}} doit être un tableau',
      length_not_in_range:
        "La longueur du tableau {{label}} n'est pas dans la plage spécifiée",
      not_unique: 'Les éléments du tableau {{label}} ne peuvent pas être répétés',
    },
    boolean: {
      must_be_boolean: '{{label}} doit être une valeur booléenne',
    },
    buffer: {
      must_be_buffer: '{{label}} doit être Buffer',
    },
    stream: {
      must_be_stream: '{{label}} doit être Stream',
    },
    date: {
      must_be_date: '{{label}} doit être une date',
      not_in_range: "{{label}} n'est pas dans la plage de temps autorisée",
    },
    number: {
      must_be_number: '{{label}} doit être un nombre',
      must_be_integer: '{{label}} doit être un entier',
      must_be_bigint: '{{label}} doit être un BigInt',
      not_in_range: '{{label}} dépasse la plage de valeurs autorisée',
    },
    string: {
      must_be_string: '{{label}} doit être une chaîne',
      must_be_email: '{{label}} doit être au format email',
      must_be_hash: '{{label}} doit être au format hachage',
      must_be_ip: '{{label}} doit être une adresse IP{{versions}}',
      must_be_ulid: '{{label}} doit être au format ULID',
      must_be_uuid: '{{label}} doit être au format UUID{{versions}}',
      length_not_in_range: 'La longueur {{label}} ne répond pas aux exigences',
      not_match_pattern: '{{label}} ne respecte pas les règles',
    },
    object: {
      must_be_object: '{{label}} doit être un objet',
    },
    enum: {
      not_in_range: "{{label}} n'est pas dans la plage d'énumération",
      only_support_string_number_boolean:
        "Les valeurs d'énumération ne peuvent être que des chaînes, des nombres et des valeurs booléennes.",
      value_can_not_be_empty:
        'La valeur d\'énumération ne peut pas être une valeur nulle "{{item}}"',
      ranges_can_not_be_empty: "La plage d'énumération ne peut pas être vide",
      default_not_in_range:
        'La valeur par défaut "{{item}}" n\'est pas dans la plage d\'énumération',
    },
    literal: {
      not_match: "{{label}} n'est pas la valeur spécifiée",
      unsupported_value:
        'Prend uniquement en charge les chaînes, les nombres, les booléens et les valeurs nulles',
    },
    one_of: {
      not_match_rule: '{{label}} ne respecte pas les règles',
      match_multiple_rule: '{{label}} respecte de nombreuses règles',
    },
    any_of: {
      not_match_rule: '{{label}} ne respecte pas les règles',
    },
    all_of: {
      not_match_all: '{{label}} ne répond pas à toutes les règles',
    },
    url: {
      must_be_url: '{{label}} doit être au format URL',
      unsupported_scheme:
        '{{label}} contient un protocole URL non pris en charge : {{scheme}}',
    },
  },
});
