/**
 * coding.js v1.1 | https://github.com/weekdaycare/hexo-theme-stellar/
 * 格式与官方标签插件一致使用空格分隔，中括号内的是可选参数（中括号不需要写出来）
 *
 * {% coding url[#L1-L4] [lang:string] [withcss:boolean] %}
 */

'use strict'

module.exports = ctx => function(args) {
  args = ctx.args.map(args, ['lang', 'withcss'], ['url'])
  const api = ctx.theme.config.tag_plugins.coding?.api.replace(/\/$/, '')
  const lazyload = ctx.theme.config.plugins.lazyload.enable
  args.url = api + '/api/v1/generate?url=' + args.url
  args.withcss = args.withcss || 'true'
  if (args.url.includes('#')) {
    args.url = args.url.replace('#', '&lines=');
  }
  var el = ''
  el += `<div class="tag-plugin ds-coding"`
  el += ' ' + ctx.args.joinTags(args, ['url', 'lang', 'withcss']).join(' ')
  if (lazyload) {
    el += 'lazyload'
  }
  el += '>'
  el += '</div>'
  return el
}
