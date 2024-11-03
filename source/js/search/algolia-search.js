utils.jq(() => {
  $(function () {
    const $inputArea = $("input#search-input");
    if ($inputArea.length === 0) {
      return;
    }

    const $resultArea = $("#search-result");
    const $searchWrapper = $("#search-wrapper");
    const $searchMask = $("#search-mask"); // 添加遮罩层的选择器
    const client = algoliasearch(window.searchConfig.appId, window.searchConfig.apiKey);
    const index = client.initIndex(window.searchConfig.indexName);

    function filterResults(hits, filterPath) {
      if (!filterPath || filterPath === '/') return hits;
      const regex = new RegExp(filterPath);
      return hits.filter(hit => regex.test(hit.url));
    }

    function displayResults(hits) {
      const $resultList = $("<ul>").addClass("search-result-list");
      if (hits.length === 0) {
        $searchWrapper.addClass('noresult');
      } else {
        $searchWrapper.removeClass('noresult');
        hits.forEach(hit => {
          const contentSnippet = hit._snippetResult.content.value;
          const title = hit.hierarchy.lvl1 || 'Untitled';
          const $item = $("<li>").html(`
            <a href="${hit.url}">
              <span class='search-result-title'>${title}</span>
              <p class="search-result-content">${contentSnippet}</p>
            </a>
          `);
          $resultList.append($item);
        });
      }
      $resultArea.html($resultList);
    }

    $inputArea.on("input", function() {
      const query = $(this).val().trim();
      const filterPath = $inputArea.data('filter');

      if (query.length <= 0) {
        $searchWrapper.attr('searching', 'false');
        $resultArea.empty();
        return;
      }

      $searchWrapper.attr('searching', 'true');

      index.search(query, {
        hitsPerPage: window.searchConfig.hitsPerPage,
        attributesToHighlight: ['content'],
        attributesToSnippet: ['content:30'],
        highlightPreTag: '<span class="search-keyword">',
        highlightPostTag: '</span>',
        restrictSearchableAttributes: ['content']
      }).then(function(responses) {
        displayResults(filterResults(responses.hits, filterPath));
      });
    });

    $inputArea.on("keydown", function(e) {
      if (e.which == 13) {
        e.preventDefault();
      }
    });

    const observer = new MutationObserver(function(mutationsList) {
      if (mutationsList.length === 1) {
        if (mutationsList[0].addedNodes.length) {
          $searchWrapper.removeClass('noresult');
        } else if (mutationsList[0].removedNodes.length) {
          $searchWrapper.addClass('noresult');
        }
      }
    });

    observer.observe($resultArea[0], { childList: true });

    // 处理搜索框的显示与隐藏
    const searchButton = $("#search-button a");
    searchButton.on("click", function() {
      $searchWrapper.show();
      $searchMask.show(); // 显示遮罩层
      $inputArea.focus(); // 聚焦到输入框
    });

    $searchMask.on("click", function() {
      $searchWrapper.hide();
      $searchMask.hide(); // 隐藏遮罩层
    });

    const closeButton = $("#search-close");
    if (closeButton.length) {
      closeButton.on("click", function() {
        $searchWrapper.hide();
        $searchMask.hide(); // 隐藏遮罩层
      });
    }
  })
});
