/**
 * video.js v1.0 | https://github.com/xaoxuu/hexo-theme-stellar/
 * 格式与官方标签插件一致使用空格分隔，中括号内的是可选参数（中括号不需要写出来）
 *
 * {% video src %}
 *
 */

'use strict';

module.exports = ctx => function (args) {
  args = ctx.args.map(args, ['type', 'bilibili', 'youtube', 'ratio', 'width', 'autoplay'], ['src'])
  const lazyload = ctx.theme.config.plugins.lazyload.enable
  if (args.width == null) {
    args.width = '100%'
  }
  if (args.bilibili) {
    return `<div class="tag-plugin video" style="aspect-ratio:${args.ratio || 16 / 9};max-width:${args.width};">
    <iframe class="${lazyload ? 'lazy' : ''}" ${lazyload ? 'data-src' : 'src'}="https://player.bilibili.com/player.html?bvid=${args.bilibili}&autoplay=${args.autoplay || 'false'}" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true">
    </iframe>
    </div>
    `
  }
  if (args.youtube) {
    if(args.autoplay == 'true' || args.autoplay == '1') { 
      args.autoplay = '1&mute=1'
    } else {
      args.autoplay = '0'
    }
    return `<div class="tag-plugin video" style="aspect-ratio:${args.ratio || 16 / 9};max-width:${args.width};">
    <iframe class="${lazyload ? 'lazy' : ''}" style="border:none" ${lazyload ? 'data-src' : 'src'}="https://www.youtube.com/embed/${args.youtube}?rel=0&disablekb=1&playsinline=1&autoplay=${args.autoplay}" picture-in-picture="true" allowfullscreen="true" >
    </iframe>
    </div>
    `
  }
  return `<div class="tag-plugin video" style="max-width:${args.width};">
  <video class="${lazyload ? 'lazy' : ''}" controls preload="none">
  <source ${lazyload ? 'data-src' : 'src'}="${args.src}" type="${args.type || 'video/mp4'}">Your browser does not support the video tag.
  </video>
  </div>
  `
}
