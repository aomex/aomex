import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** ja-JP */
export default I18n.satisfies(zh).define({
  eject: 'スケジュールされたタスクリストをエクスポートする',
  start: 'スケジュールされたタスクを開始する',
  stop: 'スケジュールされたタスクを停止する',
  stats: 'スケジュールされたタスクの実行ステータスを確認する',
  not_started: 'スケジュールされたタスクは開始されていません。ポート: {{port}}',
  invalid_cron_time: '無効な cron 式: {{time}}',
});
