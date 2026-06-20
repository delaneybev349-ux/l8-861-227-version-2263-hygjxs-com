(function () {
    function toggleMobileMenu() {
        var button = document.querySelector("[data-menu-button]");
        var panel = document.querySelector("[data-mobile-panel]");
        if (!button || !panel) {
            return;
        }
        button.addEventListener("click", function () {
            panel.classList.toggle("is-open");
        });
    }

    function setupHero() {
        var hero = document.querySelector("[data-hero]");
        if (!hero) {
            return;
        }
        var slides = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-slide]"));
        var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
        if (slides.length < 2) {
            return;
        }
        var index = 0;
        function show(next) {
            index = (next + slides.length) % slides.length;
            slides.forEach(function (slide, current) {
                slide.classList.toggle("is-active", current === index);
            });
            dots.forEach(function (dot, current) {
                dot.classList.toggle("is-active", current === index);
            });
        }
        dots.forEach(function (dot) {
            dot.addEventListener("click", function () {
                var value = parseInt(dot.getAttribute("data-hero-dot"), 10);
                if (!Number.isNaN(value)) {
                    show(value);
                }
            });
        });
        window.setInterval(function () {
            show(index + 1);
        }, 5200);
    }

    function setupFilters() {
        var panel = document.querySelector("[data-filter-panel]");
        var grid = document.querySelector("[data-card-grid]");
        if (!panel || !grid) {
            return;
        }
        var search = panel.querySelector("[data-filter-search]");
        var category = panel.querySelector("[data-filter-category]");
        var year = panel.querySelector("[data-filter-year]");
        var type = panel.querySelector("[data-filter-type]");
        var status = panel.querySelector("[data-filter-status]");
        var empty = document.querySelector("[data-empty-state]");
        var cards = Array.prototype.slice.call(grid.querySelectorAll("[data-card]"));
        var params = new URLSearchParams(window.location.search);
        var query = params.get("q");
        if (query && search) {
            search.value = query;
        }
        function valueOf(field) {
            return field ? field.value.trim().toLowerCase() : "";
        }
        function apply() {
            var keyword = valueOf(search);
            var categoryValue = valueOf(category);
            var yearValue = valueOf(year);
            var typeValue = valueOf(type);
            var visible = 0;
            cards.forEach(function (card) {
                var text = card.getAttribute("data-text") || "";
                var cardCategory = (card.getAttribute("data-category") || "").toLowerCase();
                var cardYear = (card.getAttribute("data-year") || "").toLowerCase();
                var cardType = (card.getAttribute("data-type") || "").toLowerCase();
                var matched = true;
                if (keyword && text.indexOf(keyword) === -1) {
                    matched = false;
                }
                if (categoryValue && cardCategory !== categoryValue) {
                    matched = false;
                }
                if (yearValue && cardYear !== yearValue) {
                    matched = false;
                }
                if (typeValue && cardType !== typeValue) {
                    matched = false;
                }
                card.style.display = matched ? "" : "none";
                if (matched) {
                    visible += 1;
                }
            });
            if (empty) {
                empty.classList.toggle("is-visible", visible === 0);
            }
            if (status) {
                status.textContent = visible === 0 ? "未找到匹配影片。" : "筛选结果已更新。";
            }
        }
        [search, category, year, type].forEach(function (field) {
            if (field) {
                field.addEventListener("input", apply);
                field.addEventListener("change", apply);
            }
        });
        apply();
    }

    function setupPlayers() {
        var players = Array.prototype.slice.call(document.querySelectorAll("[data-player]"));
        players.forEach(function (wrap) {
            var video = wrap.querySelector("video");
            var overlay = wrap.querySelector("[data-play-button]");
            if (!video || !overlay) {
                return;
            }
            var source = video.getAttribute("data-play");
            var prepared = false;
            function prepare() {
                if (prepared || !source) {
                    return;
                }
                if (video.canPlayType("application/vnd.apple.mpegurl")) {
                    video.src = source;
                } else if (window.Hls && window.Hls.isSupported()) {
                    var hls = new window.Hls({
                        enableWorker: true,
                        lowLatencyMode: true
                    });
                    hls.loadSource(source);
                    hls.attachMedia(video);
                    video.hlsInstance = hls;
                } else {
                    video.src = source;
                }
                prepared = true;
            }
            function start() {
                prepare();
                overlay.classList.add("is-hidden");
                var playPromise = video.play();
                if (playPromise && typeof playPromise.catch === "function") {
                    playPromise.catch(function () {
                        overlay.classList.remove("is-hidden");
                    });
                }
            }
            overlay.addEventListener("click", start);
            video.addEventListener("click", function () {
                if (video.paused) {
                    start();
                } else {
                    video.pause();
                }
            });
            video.addEventListener("play", function () {
                overlay.classList.add("is-hidden");
            });
            video.addEventListener("pause", function () {
                if (!video.ended) {
                    overlay.classList.remove("is-hidden");
                }
            });
            video.addEventListener("ended", function () {
                overlay.classList.remove("is-hidden");
            });
        });
    }

    document.addEventListener("DOMContentLoaded", function () {
        toggleMobileMenu();
        setupHero();
        setupFilters();
        setupPlayers();
    });
})();
