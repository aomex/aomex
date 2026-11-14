import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** hu-HU */
export default I18n.satisfies(zh).define({
  eject: 'Ütemezett feladatlista exportálása',
  start: 'Indítson el egy ütemezett feladatot',
  stop: 'Állítsa le az ütemezett feladatokat',
  stats: 'Ellenőrizze az ütemezett feladatok végrehajtási állapotát',
  not_started: 'Az ütemezett feladat nem indul el, port: {{port}}',
  invalid_cron_time: 'Érvénytelen cron kifejezés: {{time}}',
});
