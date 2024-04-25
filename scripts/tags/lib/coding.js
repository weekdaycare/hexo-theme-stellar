/**
 * coding.js v1.0 | https://github.com/weekdaycare/hexo-theme-stellar/
 * 格式与官方标签插件一致使用空格分隔，中括号内的是可选参数（中括号不需要写出来）
 *
 * {% coding url [lang:string] [withcss:boolean] %}
 */

'use strict'

module.exports = ctx => function(args) {
  args = ctx.args.map(args, ['lang', 'withcss'], ['url'])
  const api = ctx.theme.config.tag_plugins.coding?.api.replace(/\/$/, '')
  if (!args.withcss) {
    args.withcss = 'true'
  }
  args.url = api + '/api/v1/generate?url=' + args.url
  var el = ''
  el += `<div class="tag-plugin ds-coding"`
  el += ' ' + ctx.args.joinTags(args, ['url', 'lang', 'withcss']).join(' ')
  el += '>'
  el += '</div>'
  return el
}
