/**
 * coding.js v1.0 | https://github.com/weekdaycare/hexo-theme-stellar/
 * 格式与官方标签插件一致使用空格分隔，中括号内的是可选参数（中括号不需要写出来）
 *
 * {% coding url [lang:string] [withcss:boolean] %}
 */

'use strict';

module.exports = ctx => function(args) {
  args = ctx.args.map(args, ['lang', 'withcss'], ['url']);
  if (args.url == null) {
    return '';
  }
  const api = ctx.theme.config.tag_plugins.code?.api;
  const apiUrl = api.endsWith('/') ? api.slice(0, -1) : api;
  let fullUrl = `${apiUrl}/api/v1/generate?url=${args.url}`;
  if (args.lang) {
    fullUrl += `&lang=${args.lang}`;
  }
  if (args.withcss) {
    fullUrl += `&withcss=${args.withcss}`;
  } 

  const scriptTag = `<script src="${fullUrl}"></script>`;
  return scriptTag;
};
