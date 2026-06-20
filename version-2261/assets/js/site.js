(function () {
    const menuButton = document.querySelector('[data-menu-button]');
    const menuPanel = document.querySelector('[data-menu-panel]');

    if (menuButton && menuPanel) {
        menuButton.addEventListener('click', function () {
            menuPanel.classList.toggle('is-open');
        });
    }

    document.querySelectorAll('[data-back-top]').forEach(function (button) {
        button.addEventListener('click', function () {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    });

    document.querySelectorAll('[data-search-form]').forEach(function (form) {
        form.addEventListener('submit', function (event) {
            event.preventDefault();
            const input = form.querySelector('input[name="q"]');
            const query = input ? input.value.trim() : '';
            const target = query ? './search.html?q=' + encodeURIComponent(query) : './search.html';
            window.location.href = target;
        });
    });

    const slides = Array.from(document.querySelectorAll('[data-hero-slide]'));
    const dots = Array.from(document.querySelectorAll('[data-hero-dot]'));
    let currentSlide = 0;
    let heroTimer = null;

    function showSlide(index) {
        if (!slides.length) {
            return;
        }
        currentSlide = (index + slides.length) % slides.length;
        slides.forEach(function (slide, itemIndex) {
            slide.classList.toggle('is-active', itemIndex === currentSlide);
        });
        dots.forEach(function (dot, itemIndex) {
            dot.classList.toggle('is-active', itemIndex === currentSlide);
        });
    }

    function startHeroTimer() {
        if (!slides.length) {
            return;
        }
        window.clearInterval(heroTimer);
        heroTimer = window.setInterval(function () {
            showSlide(currentSlide + 1);
        }, 5200);
    }

    if (slides.length) {
        document.querySelectorAll('[data-hero-prev]').forEach(function (button) {
            button.addEventListener('click', function () {
                showSlide(currentSlide - 1);
                startHeroTimer();
            });
        });
        document.querySelectorAll('[data-hero-next]').forEach(function (button) {
            button.addEventListener('click', function () {
                showSlide(currentSlide + 1);
                startHeroTimer();
            });
        });
        dots.forEach(function (dot) {
            dot.addEventListener('click', function () {
                showSlide(Number(dot.dataset.heroDot || 0));
                startHeroTimer();
            });
        });
        startHeroTimer();
    }

    document.querySelectorAll('[data-filter-scope]').forEach(function (scope) {
        const input = scope.querySelector('.js-filter-input');
        const yearSelect = scope.querySelector('.js-filter-year');
        const typeSelect = scope.querySelector('.js-filter-type');
        const categorySelect = scope.querySelector('.js-filter-category');
        const cards = Array.from(scope.querySelectorAll('.js-card'));
        const empty = scope.querySelector('[data-empty-results]');
        const params = new URLSearchParams(window.location.search);
        const initialQuery = params.get('q') || '';

        if (input && initialQuery) {
            input.value = initialQuery;
        }

        function applyFilter() {
            const query = input ? input.value.trim().toLowerCase() : '';
            const year = yearSelect ? yearSelect.value : '';
            const type = typeSelect ? typeSelect.value : '';
            const category = categorySelect ? categorySelect.value : '';
            let visibleCount = 0;

            cards.forEach(function (card) {
                const text = ((card.dataset.title || '') + ' ' + (card.dataset.keywords || '')).toLowerCase();
                const yearOk = !year || card.dataset.year === year;
                const typeOk = !type || card.dataset.type === type;
                const categoryOk = !category || card.dataset.category === category;
                const queryOk = !query || text.indexOf(query) !== -1;
                const visible = yearOk && typeOk && categoryOk && queryOk;

                card.style.display = visible ? '' : 'none';
                if (visible) {
                    visibleCount += 1;
                }
            });

            if (empty) {
                empty.classList.toggle('is-visible', visibleCount === 0);
            }
        }

        [input, yearSelect, typeSelect, categorySelect].forEach(function (control) {
            if (control) {
                control.addEventListener('input', applyFilter);
                control.addEventListener('change', applyFilter);
            }
        });

        applyFilter();
    });
})();

function initPlayer(videoId, source) {
    const video = document.getElementById(videoId);
    const overlay = document.querySelector('[data-player-start]');

    if (!video || !source) {
        return;
    }

    if (window.Hls && window.Hls.isSupported()) {
        const hls = new window.Hls({ enableWorker: true, lowLatencyMode: true });
        hls.loadSource(source);
        hls.attachMedia(video);
    } else {
        video.src = source;
    }

    function playVideo() {
        if (overlay) {
            overlay.classList.add('is-hidden');
        }
        const result = video.play();
        if (result && typeof result.catch === 'function') {
            result.catch(function () {
                if (overlay) {
                    overlay.classList.remove('is-hidden');
                }
            });
        }
    }

    function pauseVideo() {
        video.pause();
        if (overlay) {
            overlay.classList.remove('is-hidden');
        }
    }

    if (overlay) {
        overlay.addEventListener('click', playVideo);
    }

    video.addEventListener('click', function () {
        if (video.paused) {
            playVideo();
        } else {
            pauseVideo();
        }
    });

    video.addEventListener('play', function () {
        if (overlay) {
            overlay.classList.add('is-hidden');
        }
    });

    video.addEventListener('pause', function () {
        if (overlay) {
            overlay.classList.remove('is-hidden');
        }
    });
}
