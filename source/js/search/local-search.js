var searchFunc = function(path, filter, wrapperId, searchId, contentId) {

  function getAllCombinations(keywords) {
    let result = [];
    const len = keywords.length;
    for (let i = 0; i < len; i++) {
      for (let j = i + 1; j <= len; j++) {
        result.push(keywords.slice(i, j).join(" "));
      }
    }
    return result;
  }

  // 防抖函数减少触发频率
  function debounce(func, wait) {
    let timeout;
    return function(...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  }

  $.ajax({
    url: path,
    dataType: "json",
    success: function(jsonResponse) {
      const datas = jsonResponse;
      const $input = document.getElementById(searchId);
      if (!$input) { return; }
      const $resultContent = document.getElementById(contentId);
      const $wrapper = document.getElementById(wrapperId);

      // 输入事件处理，使用防抖优化
      const handleInput = debounce(function() {
        const resultList = [];
        const query = this.value.trim().toLowerCase();
        if (query.length <= 0) {
          $wrapper.setAttribute('searching', 'false');
          $resultContent.innerHTML = "";
          return;
        }
        $wrapper.setAttribute('searching', 'true');

        // 获取所有关键词组合并排序
        const keywords = getAllCombinations(query.split(" "))
          .sort((a, b) => b.split(" ").length - a.split(" ").length);

        datas.forEach(data => {
          if (!data.content || !data.content.trim().length) return;
          if (filter && !data.path.includes(filter)) return;
          
          const dataTitle = data.title?.trim() || 'Untitled';
          const dataTitleLowerCase = dataTitle.toLowerCase();
          const dataContent = data.content;
          const dataContentLowerCase = dataContent.toLowerCase();
          const dataUrl = data.path.startsWith('//') ? data.path.slice(1) : data.path;

          let matches = 0;
          let firstOccur = -1;
          // 检查关键词匹配
          keywords.forEach(keyword => {
            const indexTitle = dataTitleLowerCase.indexOf(keyword);
            const indexContent = dataContentLowerCase.indexOf(keyword);

            if (indexTitle >= 0 || indexContent >= 0) {
              matches += 1;
              if (indexContent < 0) {
                firstOccur = 0;
              } else if (firstOccur < 0) {
                firstOccur = indexContent;
              }
            }
          });
          // 如果有匹配结果，生成结果项
          if (matches > 0) {
            let matchContent = '';
            if (firstOccur >= 0) {
              let start = Math.max(firstOccur - 20, 0);
              let end = Math.min(firstOccur + 80, dataContent.length);
              matchContent = dataContent.substring(start, end);

              // 高亮匹配的关键词
              const regS = new RegExp(keywords.join("|"), "gi");
              matchContent = matchContent.replace(regS, keyword => `<span class="search-keyword">${keyword}</span>`);
            }

            resultList.push({
              rank: matches,
              str: `
                <li>
                  <a href="${dataUrl}">
                    <span class="search-result-title">${dataTitle}</span>
                    ${matchContent ? `<p class="search-result-content">${matchContent}...</p>` : ''}
                  </a>
                </li>
              `
            });
          }
        });
        if (resultList.length) {
          resultList.sort((a, b) => b.rank - a.rank);
          $resultContent.innerHTML = `<ul class="search-result-list">${resultList.map(item => item.str).join('')}</ul>`;
        }
      }, 300);

      // 监听输入事件
      $input.addEventListener("input", handleInput);
    }
  });
};

utils.jq(() => {
  $(function () {
    const $inputArea = $("#search-input");
    if ($inputArea.length == 0) {
      return;
    }
    const $resultArea = document.querySelector("div#search-result");
    $inputArea.focus(function() {
      let path = ctx.search.path;
      if (path.startsWith('/')) {
        path = path.substring(1);
      }
      path = ctx.root + path;
      const filter = $inputArea.attr('data-filter') || '';
      searchFunc(path, filter, 'search-wrapper', 'search-input', 'search-result');
    });
    // 阻止回车默认事件
    $inputArea.keydown(function(e) {
      if (e.which == 13) {
        e.preventDefault();
      }
    });
    // 监听搜索结果变化，更新样式
    const observer = new MutationObserver(function(mutationsList) {
      if (mutationsList.length == 1) {
        if (mutationsList[0].addedNodes.length) {
          $('.search-wrapper').removeClass('noresult');
        } else if (mutationsList[0].removedNodes.length) {
          $('.search-wrapper').addClass('noresult');
        }
      }
    });
    observer.observe($resultArea, { childList: true });

    const $searchButton = $("#search-button a");
    const $searchWrapper = $("#search-wrapper");
    const $searchMask = $("#search-mask");

    const toggleSearch = (show) => {
      const method = show ? 'fadeIn' : 'fadeOut';
      $searchWrapper.stop(true, true)[method](300);
      $searchMask.stop(true, true)[method](300);
      if (show) $inputArea.focus();
    };

    $searchButton.on("click", () => toggleSearch(true));
    $searchMask.on("click", () => toggleSearch(false));

    const $closeButton = $("#search-close");
    if ($closeButton.length) {
      $closeButton.on("click", () => toggleSearch(false));
    }
  });
});