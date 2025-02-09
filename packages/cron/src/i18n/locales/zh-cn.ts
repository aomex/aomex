import { I18n } from '@aomex/common';

export const zh = I18n.define({
  eject: '导出定时任务列表',
  start: '启动定时任务',
  stop: '退出定时任务',
  stats: '查看定时任务执行状态',
  not_started: '定时任务未启动，端口：{{port}}',
  invalid_cron_time: '时间表达式不合法：{{time}}',
});
