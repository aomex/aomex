import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** mn-MN */
export default I18n.satisfies(zh).define({
  eject: 'Төлөвлөсөн ажлын жагсаалтыг экспортлох',
  start: 'Төлөвлөсөн ажлыг эхлүүл',
  stop: 'Төлөвлөсөн ажлуудаа зогсоо',
  stats: 'Төлөвлөсөн ажлуудын гүйцэтгэлийн байдлыг шалгана уу',
  not_started: 'Төлөвлөсөн ажил эхлээгүй байна, порт: {{port}}',
  invalid_cron_time: 'Буруу крон илэрхийлэл: {{time}}',
  invalid_port: 'Буруу серверийн порт: {{port}} (хүчинтэй хүрээ: 1-65535)',
});
