/**
 * chat.js v1 | https://github.com/weekdaycare/hexo-theme-stellar/
 *
 * {% chat [title:导航栏标题可选] %}
 * <!-- chat user1 -->
 * 你好 // 文字消息，默认靠左布局
 * <!-- chat user2 align:right -->
 * Are U OK // 文字消息，靠右布局（我发送的消息）
 * <!-- chat user3 -->
 * {% image %}// 图片消息（嵌套image标签）
 * <!-- chat user3 -->
 * {% emoji xxx %} // 表情包消息（嵌套emoji组件）
 * {% audio src %} // 语音消息（嵌套audio组件）
 * {% video src %} // 视频消息（嵌套video组件）
 * {% endchat %}
 *
 */

'use strict'

module.exports = ctx => function(args, content = '') {
  args = ctx.args.map(args, ['title'], 'user')
  var contentArray = content.split(/<!--\s*chat (.*?)\s*-->/g).filter(item => item.trim().length > 0)
  if (contentArray.length < 1) {
    console.error('invalid chat tag:', contentArray);
    return ''
  }

  var el = '<div class="tag-plugin chat">';

  if (args.title) el += `<div class="chat-title">${args.title}</div>`;
  
  for (let i = 0; i < contentArray.length; i += 2) {
    const user = contentArray[i]
    const messageContent = contentArray[i + 1].trim()
    
    const align = user.includes('align:right') ? 'right' : 'left'

    el += `<div class="chat-item ${align}" id="chat-${i/2}">`
    el += `<span class="user">${user.split(' ')[0]}</span>`

    // Split message content by two or more newlines
    const messages = messageContent.split(/\n\s*\n/).filter(item => item.trim().length > 0)
    messages.forEach(message => {
      el += `<div class="message fs14">${ctx.render.renderSync({text: message, engine: 'markdown'}).trim()}</div>`
    })

    el += `</div>`
  }
  
  el += '</div>'
  return el
}
