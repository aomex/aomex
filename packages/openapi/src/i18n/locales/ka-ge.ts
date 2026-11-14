import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** ka-GE */
export default I18n.satisfies(zh).define({
  initialize: 'ინიციალიზაციის დოკუმენტი',
  search_routers_files: 'მარშრუტიზაციის ფაილების ძიება',
  parse_routers: 'მარშრუტის გაანალიზება',
  add_tag: 'ტეგის დამატება',
  hand_fix_documentation: 'შეაკეთეთ დოკუმენტები ხელით',
  optimize_parameter: 'ოპტიმიზაციის პარამეტრები',
  save_to_file: 'ფაილში შენახვა',
  validate: 'გადაამოწმეთ დოკუმენტი',
  help_summary: 'OpenAPI v3 დოკუმენტაციის გენერატორი',
  has_error: '{{error_count}} შეცდომები, {{warning_count}} გაფრთხილებები',
  no_error: 'შეცდომების გარეშე',
});
