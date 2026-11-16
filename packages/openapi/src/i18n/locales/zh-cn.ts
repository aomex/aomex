import { I18n } from '@aomex/common';

export const zh = I18n.define({
  initialize: '初始化文档',
  search_routers_files: '搜索路由文件',
  parse_routers: '解析路由',
  add_tag: '添加标签',
  hand_fix_documentation: '手动修复文档',
  optimize_parameter: '优化参数',
  save_to_file: '保存到文件',
  validate: '验证文档',
  help_summary: 'OpenAPI v3 文档生成器',
  help_app_listen_tip:
    '请将 new WebApp 与 app.listen 拆开（或仅在入口 listen），避免 CLI import 时副作用起服',
  has_error: '{{error_count}} 个错误，{{warning_count}} 条警告',
  no_error: '没有错误',
});
