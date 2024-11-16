utils.js(window.searchConfig.js).then(() => {
  utils.jq(() => {
    const $inputArea = $("#search-input");
    if ($inputArea.length === 0) return;

    const $resultArea = $("#search-result");
    const $searchWrapper = $("#search-wrapper");
    const $searchMask = $("#search-mask");
    const client = algoliasearch(window.searchConfig.appId, window.searchConfig.apiKey);
    const index = client.initIndex(window.searchConfig.indexName);

    const filterResults = (hits, filterPath) => {
      if (!filterPath || filterPath === '/') return hits;
      const regex = new RegExp(filterPath);
      return hits.filter(hit => regex.test(hit.url));
    };

    const displayResults = hits => {
      const $resultList = $("<ul>").addClass("search-result-list");
      if (hits.length === 0) {
        $searchWrapper.addClass('noresult');
      } else {
        $searchWrapper.removeClass('noresult');
        hits.forEach(hit => {
          const contentSnippet = hit._snippetResult.content.value;
          const title = hit.hierarchy.lvl1 || 'Untitled';
          const $item = $(`
            <li>
              <a href="${hit.url}">
                <span class='search-result-title'>${title}</span>
                <p class="search-result-content">${contentSnippet}</p>
              </a>
            </li>
          `);
          $resultList.append($item);
        });
      }
      $resultArea.html($resultList);
    };

    const handleInput = debounce(() => {
      const query = $inputArea.val().trim();
      const filterPath = $inputArea.data('filter');
      if (!query) {
        $searchWrapper.attr('searching', 'false');
        $resultArea.empty();
        return;
      }
      $searchWrapper.attr('searching', 'true');
      index.search(query, {
        hitsPerPage: window.searchConfig.hitsPerPage,
        attributesToHighlight: ['content'],
        attributesToSnippet: ['content:40'],
        highlightPreTag: '<span class="search-keyword">',
        highlightPostTag: '</span>',
        restrictSearchableAttributes: ['content']
      }).then(responses => {
        displayResults(filterResults(responses.hits, filterPath));
      });
    }, 300);

    $inputArea.on("input", handleInput);
    $inputArea.on("keydown", e => {
      if (e.which == 13) e.preventDefault();
    });

    const observer = new MutationObserver(mutationsList => {
      if (mutationsList.length === 1) {
        $searchWrapper.toggleClass('noresult', !mutationsList[0].addedNodes.length);
      }
    });

    observer.observe($resultArea[0], { childList: true });

    const toggleSearch = (show) => {
      const method = show ? 'fadeIn' : 'fadeOut';
      $searchWrapper.stop(true, true)[method](300);
      $searchMask.stop(true, true)[method](300);
      if (show) {
        $inputArea.focus();
      } else {
        clearSearch();
      }
    };

    const clearSearch = () => {
      $inputArea.val('');
      $resultArea.html('');
    };

    $("#search-button a").on("click", () => toggleSearch(true));
    $searchMask.on("click", () => toggleSearch(false));
    $("#search-close").on("click", () => toggleSearch(false));
    $("#search-clear").on("click", clearSearch);
  });
});

// 防抖函数
function debounce(func, wait) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}
