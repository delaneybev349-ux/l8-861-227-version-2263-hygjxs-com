(function () {
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');

  if (toggle && links) {
    toggle.addEventListener('click', function () {
      const opened = links.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', opened ? 'true' : 'false');
    });
  }

  const hero = document.querySelector('[data-hero]');

  if (hero) {
    const slides = Array.from(hero.querySelectorAll('.hero-slide'));
    const dots = Array.from(hero.querySelectorAll('.hero-dot'));
    let current = 0;

    function showSlide(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === current);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === current);
      });
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        showSlide(Number(dot.dataset.slide || 0));
      });
    });

    if (slides.length > 1) {
      setInterval(function () {
        showSlide(current + 1);
      }, 5200);
    }
  }

  const filterInputs = Array.from(document.querySelectorAll('.local-filter-input'));

  filterInputs.forEach(function (input) {
    const panel = input.closest('.filter-panel');
    const chips = panel ? Array.from(panel.querySelectorAll('.filter-chip')) : [];
    const grid = document.querySelector('.filterable-grid');
    const cards = grid ? Array.from(grid.querySelectorAll('.movie-card')) : [];
    let activeFilter = 'all';

    function applyFilter() {
      const query = input.value.trim().toLowerCase();
      cards.forEach(function (card) {
        const haystack = [
          card.dataset.title,
          card.dataset.type,
          card.dataset.region,
          card.dataset.year,
          card.dataset.genre
        ].join(' ').toLowerCase();
        const typeValue = (card.dataset.type || '') + ' ' + (card.dataset.genre || '') + ' ' + (card.dataset.title || '');
        const matchQuery = !query || haystack.indexOf(query) !== -1;
        const matchType = activeFilter === 'all' || typeValue.indexOf(activeFilter) !== -1;
        card.classList.toggle('is-filter-hidden', !(matchQuery && matchType));
      });
    }

    input.addEventListener('input', applyFilter);

    chips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        activeFilter = chip.dataset.filter || 'all';
        chips.forEach(function (item) {
          item.classList.toggle('is-active', item === chip);
        });
        applyFilter();
      });
    });
  });
})();
