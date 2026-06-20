(function () {
  const form = document.querySelector('.search-form');
  const input = document.querySelector('.search-input');
  const typeSelect = document.querySelector('.search-type');
  const results = document.querySelector('.search-results');
  const status = document.querySelector('.search-status');
  const items = Array.isArray(window.SEARCH_ITEMS) ? window.SEARCH_ITEMS : [];

  if (!form || !input || !typeSelect || !results || !status) {
    return;
  }

  function render(list) {
    results.innerHTML = list.slice(0, 120).map(function (item) {
      return [
        '<article class="movie-card">',
        '<a class="poster-link" href="' + item.url + '">',
        '<img src="' + item.cover + '" alt="' + escapeHtml(item.title) + '" loading="lazy">',
        '<span class="play-circle">▶</span>',
        '<span class="type-badge">' + escapeHtml(item.type) + '</span>',
        '</a>',
        '<div class="card-body">',
        '<h3><a href="' + item.url + '">' + escapeHtml(item.title) + '</a></h3>',
        '<p>' + escapeHtml(item.oneLine) + '</p>',
        '<div class="meta-line"><span>' + escapeHtml(item.year) + '</span><span>' + escapeHtml(item.region) + '</span><span>' + escapeHtml(item.genre) + '</span></div>',
        '</div>',
        '</article>'
      ].join('');
    }).join('');
    status.textContent = list.length ? '找到 ' + list.length + ' 部相关影片' : '没有找到相关影片';
  }

  function escapeHtml(value) {
    return String(value || '').replace(/[&<>"]/g, function (char) {
      return {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;'
      }[char];
    });
  }

  function search() {
    const query = input.value.trim().toLowerCase();
    const type = typeSelect.value;
    const list = items.filter(function (item) {
      const haystack = [item.title, item.year, item.region, item.type, item.genre, item.oneLine].join(' ').toLowerCase();
      const matchQuery = !query || haystack.indexOf(query) !== -1;
      const matchType = type === 'all' || item.type.indexOf(type) !== -1 || item.genre.indexOf(type) !== -1;
      return matchQuery && matchType;
    });
    render(list);
  }

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    search();
  });

  input.addEventListener('input', search);
  typeSelect.addEventListener('change', search);

  const params = new URLSearchParams(window.location.search);
  const initialQuery = params.get('q');

  if (initialQuery) {
    input.value = initialQuery;
  }

  render(items.slice(0, 36));

  if (initialQuery) {
    search();
  }
})();
