'use strict';

hexo.extend.filter.register('after_render:html', require('./lib/img_lazyload').processSite);
hexo.extend.filter.register('after_render:html', require('./lib/img_onerror').processSite);
hexo.extend.filter.register('before_generate', () => {
  const sortedPosts = hexo.locals.get('posts').toArray()
    .filter(post => post.swiper_index >= 0)
    .sort((a, b) => b.swiper_index - a.swiper_index);
  hexo.locals.set('swiper_posts', sortedPosts);
});
