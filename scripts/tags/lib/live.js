/**
 * live.js v1.0 | https://github.com/weekdaycare/hexo-theme-stellar/
 * 格式与官方标签插件一致使用空格分隔，中括号内的是可选参数（中括号不需要写出来）
 *
 * {% live [alt] photo:url video:url [width:width] [height:height] [effect:live/loop/exposure/bounce] [style:full/hint/loop] [preload:boolean] %}
 *
 */

'use strict'

module.exports = ctx => function(args) {
  args = ctx.args.map(args, ['photo', 'video', 'width', 'height', 'effect', 'style', 'preload'], ['alt'])
  args.effect = args.effect || ctx.theme.config.tag_plugins.live.effect
  args.preload = args.preload || ctx.theme.config.tag_plugins.live.preload
  args.style = args.style || ctx.theme.config.tag_plugins.live.style
  args.width = args.width || '300px'
  args.height = args.height || '400px'

  var el = ''
  el += '<div class="tag-plugin live image ds-live">'
  el += `<div class="image-bg" data-live-photo `
  el += 'data-effect-type="' + args.effect + '" '
  el += 'data-playback-style="' + args.style + '" '
  el += 'data-proactively-loads-video="' + args.preload + '" '
  el += 'data-photo-src="' + args.photo + '" '
  el += 'data-video-src="' + args.video + '" '
  el += 'style="width:' + args.width + ';height:' + args.height + '" '
  el += '></div>'
  if (args.alt && args.alt.length > 0) {
    el += '<div class="image-meta">'
    el += '<span class="image-caption center">' + args.alt + '</span>'
    el += '</div>'
  }
  el += '</div>'
  return el
}
