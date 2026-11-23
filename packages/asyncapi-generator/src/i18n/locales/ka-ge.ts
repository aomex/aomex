import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** ka-GE */
export default I18n.satisfies(zh).define({
  initialize: 'ინიციალიზაციის დოკუმენტი',
  search_channels_files: 'Channel ფაილების ძებნა',
  parse_channels: 'Channel-ების გაანალიზება',
  hand_fix_documentation: 'შეაკეთეთ დოკუმენტები ხელით',
  save_to_file: 'ფაილში შენახვა',
  validate: 'გადაამოწმეთ დოკუმენტი',
  help_summary: 'AsyncAPI 3 დოკუმენტაციის გენერატორი',
  has_error: '{{error_count}} შეცდომები, {{warning_count}} გაფრთხილებები',
  no_error: 'შეცდომების გარეშე',
});
