import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** pl-PL */
export default I18n.satisfies(zh).define({
  eject: 'Eksportuj listę zaplanowanych zadań',
  start: 'Rozpocznij zaplanowane zadanie',
  stop: 'Zatrzymaj zaplanowane zadania',
  stats: 'Sprawdź status realizacji zaplanowanych zadań',
  not_started: 'Zaplanowane zadanie nie zostało uruchomione, port: {{port}}',
  invalid_cron_time: 'Nieprawidłowe wyrażenie cron: {{time}}',
});
