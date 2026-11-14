import { I18n } from '@aomex/internal-tools';
import { zh } from './zh-cn';

/** lv-LV */
export default I18n.satisfies(zh).define({
  validator: {
    required: '{{label}} ir nepieciešams',
    array: {
      must_be_array: '{{label}} ir jābūt masīvam',
      length_not_in_range: '{{label}} masīva garums nav norādītajā diapazonā',
      not_unique: '{{label}} masīva elementus nevar atkārtot',
    },
    boolean: {
      must_be_boolean: '{{label}} ir jābūt Būla vērtībai',
    },
    buffer: {
      must_be_buffer: '{{label}} ir jābūt buferim',
    },
    stream: {
      must_be_stream: '{{label}} ir jābūt straumei',
    },
    date: {
      must_be_date: '{{label}} ir jābūt datumam',
      not_in_range: '{{label}} neietilpst atļautajā laika diapazonā',
    },
    number: {
      must_be_number: '{{label}} ir jābūt skaitlim',
      must_be_integer: '{{label}} ir jābūt veselam skaitlim',
      must_be_bigint: '{{label}} ir jābūt BigInt',
      not_in_range: '{{label}} pārsniedz atļauto vērtību diapazonu',
    },
    string: {
      must_be_string: '{{label}} ir jābūt virknei',
      must_be_email: '{{label}} ir jābūt e-pasta formātā',
      must_be_hash: '{{label}} ir jābūt jaucējformātā',
      must_be_ip: '{{label}} ir jābūt IP{{versions}} adresei',
      must_be_ulid: '{{label}} ir jābūt ULID formātā',
      must_be_uuid: '{{label}} ir jābūt formātā UUID{{versions}}',
      length_not_in_range: '{{label}} garums neatbilst prasībām',
      not_match_pattern: '{{label}} neatbilst noteikumiem',
    },
    object: {
      must_be_object: '{{label}} ir jābūt objektam',
    },
    enum: {
      not_in_range: '{{label}} nav uzskaitījuma diapazonā',
      only_support_string_number_boolean:
        'Uzskaitīšanas vērtības var būt tikai virknes, skaitļi un Būla vērtības',
      value_can_not_be_empty: 'Uzskaites vērtība nevar būt nulles vērtība "{{item}}"',
      ranges_can_not_be_empty: 'Uzskaitīšanas diapazons nedrīkst būt tukšs',
      default_not_in_range: 'Noklusējuma vērtība "{{item}}" nav uzskaitījuma diapazonā',
    },
    literal: {
      not_match: '{{label}} nav norādītā vērtība',
      unsupported_value: 'Atbalsta tikai virknes, skaitļus, Būla vērtības un nulles',
    },
    one_of: {
      not_match_rule: '{{label}} neatbilst noteikumiem',
      match_multiple_rule: '{{label}} atbilst daudziem noteikumiem',
    },
    any_of: {
      not_match_rule: '{{label}} neatbilst noteikumiem',
    },
    all_of: {
      not_match_all: '{{label}} neatbilst visiem noteikumiem',
    },
    url: {
      must_be_url: '{{label}} ir jābūt URL formātā',
      unsupported_scheme: '{{label}} satur neatbalstītu URL protokolu: {{scheme}}',
    },
  },
});
