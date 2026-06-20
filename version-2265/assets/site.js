(function () {
    var menuButton = document.querySelector('[data-menu-toggle]');
    var mobileNav = document.querySelector('[data-mobile-nav]');

    if (menuButton && mobileNav) {
        menuButton.addEventListener('click', function () {
            mobileNav.classList.toggle('is-open');
        });
    }

    document.querySelectorAll('img').forEach(function (image) {
        image.addEventListener('error', function () {
            var frame = image.closest('.poster-frame');
            if (frame) {
                frame.classList.add('no-image');
            }
        });
    });

    var hero = document.querySelector('[data-hero]');
    if (hero) {
        var slides = Array.prototype.slice.call(hero.querySelectorAll('.hero-slide'));
        var dots = Array.prototype.slice.call(hero.querySelectorAll('.hero-dot'));
        var current = 0;
        var timer = null;

        function showSlide(index) {
            current = (index + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle('is-active', slideIndex === current);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle('is-active', dotIndex === current);
            });
        }

        function startTimer() {
            window.clearInterval(timer);
            timer = window.setInterval(function () {
                showSlide(current + 1);
            }, 5200);
        }

        dots.forEach(function (dot, index) {
            dot.addEventListener('click', function () {
                showSlide(index);
                startTimer();
            });
        });

        showSlide(0);
        startTimer();
    }

    document.querySelectorAll('[data-filter-scope]').forEach(function (scope) {
        var input = scope.querySelector('[data-search-input]');
        var typeSelect = scope.querySelector('[data-filter-type]');
        var yearSelect = scope.querySelector('[data-filter-year]');
        var regionSelect = scope.querySelector('[data-filter-region]');
        var cards = Array.prototype.slice.call(scope.querySelectorAll('.movie-card'));
        var empty = scope.querySelector('[data-empty-state]');

        function normalize(value) {
            return (value || '').toString().trim().toLowerCase();
        }

        function applyFilters() {
            var keyword = normalize(input ? input.value : '');
            var typeValue = normalize(typeSelect ? typeSelect.value : '');
            var yearValue = normalize(yearSelect ? yearSelect.value : '');
            var regionValue = normalize(regionSelect ? regionSelect.value : '');
            var visible = 0;

            cards.forEach(function (card) {
                var searchText = normalize([
                    card.dataset.title,
                    card.dataset.region,
                    card.dataset.type,
                    card.dataset.year,
                    card.dataset.genre,
                    card.dataset.category
                ].join(' '));
                var matchesKeyword = !keyword || searchText.indexOf(keyword) !== -1;
                var matchesType = !typeValue || normalize(card.dataset.type).indexOf(typeValue) !== -1;
                var matchesYear = !yearValue || normalize(card.dataset.year) === yearValue;
                var matchesRegion = !regionValue || normalize(card.dataset.region).indexOf(regionValue) !== -1;
                var shouldShow = matchesKeyword && matchesType && matchesYear && matchesRegion;

                card.hidden = !shouldShow;
                if (shouldShow) {
                    visible += 1;
                }
            });

            if (empty) {
                empty.hidden = visible !== 0;
            }
        }

        [input, typeSelect, yearSelect, regionSelect].forEach(function (control) {
            if (control) {
                control.addEventListener('input', applyFilters);
                control.addEventListener('change', applyFilters);
            }
        });
    });

    document.querySelectorAll('[data-player-shell]').forEach(function (shell) {
        var video = shell.querySelector('video');
        var playButton = shell.querySelector('[data-play-button]');
        var hasStarted = false;
        var hlsInstance = null;

        function startPlayback() {
            if (!video) {
                return;
            }

            var src = video.dataset.src;
            if (!src) {
                return;
            }

            if (!hasStarted) {
                if (video.canPlayType('application/vnd.apple.mpegurl')) {
                    video.src = src;
                } else if (window.Hls && window.Hls.isSupported()) {
                    hlsInstance = new window.Hls({
                        enableWorker: true,
                        lowLatencyMode: true
                    });
                    hlsInstance.loadSource(src);
                    hlsInstance.attachMedia(video);
                } else {
                    video.src = src;
                }
                hasStarted = true;
            }

            if (playButton) {
                playButton.classList.add('is-hidden');
            }

            var playPromise = video.play();
            if (playPromise && typeof playPromise.catch === 'function') {
                playPromise.catch(function () {});
            }
        }

        if (playButton) {
            playButton.addEventListener('click', startPlayback);
        }

        if (video) {
            video.addEventListener('click', function () {
                if (!hasStarted) {
                    startPlayback();
                }
            });
            video.addEventListener('play', function () {
                if (playButton) {
                    playButton.classList.add('is-hidden');
                }
            });
            video.addEventListener('emptied', function () {
                if (hlsInstance) {
                    hlsInstance.destroy();
                    hlsInstance = null;
                }
            });
        }
    });
})();
