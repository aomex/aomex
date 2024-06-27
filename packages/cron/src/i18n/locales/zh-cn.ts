import { i18n } from '@aomex/core';

i18n.register('zh_CN', 'cron', {
  eject: '导出定时任务列表',
  start: '启动定时任务',
  stop: '退出定时任务',
  stats: '查看定时任务执行状态',
  not_started: '定时任务未启动，端口：{{port}}',
  use_stop: '执行中的任务也会被强制中断，因此推荐使用指令 "aomex cron:stop" 结束定时任务',
});
