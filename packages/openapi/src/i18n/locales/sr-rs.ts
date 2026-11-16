import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** sr-RS */
export default I18n.satisfies(zh).define({
  initialize: 'иницијализациони документ',
  search_routers_files: 'Претражите датотеке за рутирање',
  parse_routers: 'анализирати руту',
  add_tag: 'Додај ознаку',
  hand_fix_documentation: 'Поправите документе ручно',
  optimize_parameter: 'Параметри оптимизације',
  save_to_file: 'сачувати у датотеку',
  validate: 'Верификујте документ',
  help_summary: 'ОпенАПИ в3 генератор документације',
  help_app_listen_tip:
    'При прослеђивању app одвојите new WebApp и app.listen (или слушајте само у улазној датотеци) како CLI import не би покренуо сервер као споредни ефекат',
  has_error: 'ЗЗ0ЗЗ грешке, ЗЗ1ЗЗ упозорења',
  no_error: 'нема грешака',
});
