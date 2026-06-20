(function () {
  function ready(fn) {
    if (document.readyState !== 'loading') {
      fn();
    } else {
      document.addEventListener('DOMContentLoaded', fn);
    }
  }

  ready(function () {
    var menuToggle = document.querySelector('[data-menu-toggle]');
    var mobileNav = document.querySelector('[data-mobile-nav]');

    if (menuToggle && mobileNav) {
      menuToggle.addEventListener('click', function () {
        mobileNav.classList.toggle('is-open');
      });
    }

    document.querySelectorAll('[data-hero-carousel]').forEach(function (carousel) {
      var slides = Array.prototype.slice.call(carousel.querySelectorAll('[data-hero-slide]'));
      var dots = Array.prototype.slice.call(carousel.querySelectorAll('[data-slide-to]'));
      var prev = carousel.querySelector('[data-hero-prev]');
      var next = carousel.querySelector('[data-hero-next]');
      var current = 0;
      var timer = null;

      function show(index) {
        current = (index + slides.length) % slides.length;
        slides.forEach(function (slide, slideIndex) {
          slide.classList.toggle('is-active', slideIndex === current);
        });
        dots.forEach(function (dot, dotIndex) {
          dot.classList.toggle('is-active', dotIndex === current);
        });
      }

      function start() {
        stop();
        timer = window.setInterval(function () {
          show(current + 1);
        }, 5200);
      }

      function stop() {
        if (timer) {
          window.clearInterval(timer);
          timer = null;
        }
      }

      if (slides.length > 1) {
        dots.forEach(function (dot) {
          dot.addEventListener('click', function () {
            show(Number(dot.getAttribute('data-slide-to')) || 0);
            start();
          });
        });

        if (prev) {
          prev.addEventListener('click', function () {
            show(current - 1);
            start();
          });
        }

        if (next) {
          next.addEventListener('click', function () {
            show(current + 1);
            start();
          });
        }

        carousel.addEventListener('mouseenter', stop);
        carousel.addEventListener('mouseleave', start);
        start();
      }
    });

    document.querySelectorAll('[data-filter-scope]').forEach(function (scope) {
      var search = scope.querySelector('[data-filter-search]');
      var region = scope.querySelector('[data-filter-region]');
      var type = scope.querySelector('[data-filter-type]');
      var cards = Array.prototype.slice.call(scope.querySelectorAll('[data-movie-card]'));
      var empty = scope.querySelector('[data-filter-empty]');
      var params = new URLSearchParams(window.location.search);
      var query = params.get('q');

      if (query && search) {
        search.value = query;
      }

      function includes(value, needle) {
        return String(value || '').toLowerCase().indexOf(String(needle || '').toLowerCase()) !== -1;
      }

      function apply() {
        var q = search ? search.value.trim().toLowerCase() : '';
        var regionValue = region ? region.value : '';
        var typeValue = type ? type.value : '';
        var visible = 0;

        cards.forEach(function (card) {
          var haystack = [
            card.getAttribute('data-title'),
            card.getAttribute('data-region'),
            card.getAttribute('data-type'),
            card.getAttribute('data-year'),
            card.getAttribute('data-tags')
          ].join(' ').toLowerCase();
          var passSearch = !q || includes(haystack, q);
          var passRegion = !regionValue || card.getAttribute('data-region') === regionValue;
          var passType = !typeValue || includes(card.getAttribute('data-type'), typeValue) || includes(card.getAttribute('data-tags'), typeValue);
          var pass = passSearch && passRegion && passType;

          card.hidden = !pass;
          if (pass) {
            visible += 1;
          }
        });

        if (empty) {
          empty.hidden = visible !== 0;
        }
      }

      [search, region, type].forEach(function (control) {
        if (control) {
          control.addEventListener('input', apply);
          control.addEventListener('change', apply);
        }
      });

      apply();
    });
  });
})();
