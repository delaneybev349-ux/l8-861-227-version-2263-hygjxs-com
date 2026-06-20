(function () {
    function normalize(value) {
        return String(value || "").toLowerCase().trim();
    }

    function filterCards(query) {
        var term = normalize(query);
        var cards = Array.prototype.slice.call(document.querySelectorAll("[data-movie-card]"));
        var visible = 0;

        cards.forEach(function (card) {
            var search = normalize(card.getAttribute("data-search"));
            var show = !term || search.indexOf(term) !== -1;
            card.hidden = !show;
            if (show) {
                visible += 1;
            }
        });

        Array.prototype.slice.call(document.querySelectorAll("[data-empty-state]")).forEach(function (node) {
            node.hidden = visible !== 0;
        });
    }

    function setupSearch() {
        var params = new URLSearchParams(window.location.search);
        var initial = params.get("q") || "";
        var inputs = Array.prototype.slice.call(document.querySelectorAll("[data-search-input], .header-search input[name='q'], .mobile-search input[name='q']"));

        inputs.forEach(function (input) {
            if (initial && !input.value) {
                input.value = initial;
            }

            input.addEventListener("input", function () {
                if (document.querySelector("[data-movie-card]")) {
                    filterCards(input.value);
                }
            });
        });

        Array.prototype.slice.call(document.querySelectorAll("[data-search-form]")).forEach(function (form) {
            form.addEventListener("submit", function (event) {
                if (document.querySelector("[data-movie-card]")) {
                    event.preventDefault();
                    var input = form.querySelector("input[name='q']");
                    filterCards(input ? input.value : "");
                }
            });
        });

        if (initial && document.querySelector("[data-movie-card]")) {
            filterCards(initial);
        }
    }

    function setupNav() {
        var toggle = document.querySelector("[data-nav-toggle]");
        var nav = document.querySelector("[data-mobile-nav]");
        if (!toggle || !nav) {
            return;
        }
        toggle.addEventListener("click", function () {
            var expanded = toggle.getAttribute("aria-expanded") === "true";
            toggle.setAttribute("aria-expanded", String(!expanded));
            nav.hidden = expanded;
        });
    }

    function setupHero() {
        var root = document.querySelector("[data-hero-carousel]");
        if (!root) {
            return;
        }
        var slides = Array.prototype.slice.call(root.querySelectorAll(".hero-slide"));
        var dots = Array.prototype.slice.call(root.querySelectorAll("[data-hero-dot]"));
        var prev = root.querySelector("[data-hero-prev]");
        var next = root.querySelector("[data-hero-next]");
        var current = 0;
        var timer = null;

        function show(index) {
            current = (index + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle("is-active", slideIndex === current);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle("is-active", dotIndex === current);
            });
        }

        function start() {
            stop();
            timer = window.setInterval(function () {
                show(current + 1);
            }, 5600);
        }

        function stop() {
            if (timer) {
                window.clearInterval(timer);
            }
        }

        if (prev) {
            prev.addEventListener("click", function () {
                show(current - 1);
                start();
            });
        }

        if (next) {
            next.addEventListener("click", function () {
                show(current + 1);
                start();
            });
        }

        dots.forEach(function (dot) {
            dot.addEventListener("click", function () {
                show(Number(dot.getAttribute("data-hero-dot")) || 0);
                start();
            });
        });

        root.addEventListener("mouseenter", stop);
        root.addEventListener("mouseleave", start);
        show(0);
        start();
    }

    document.addEventListener("DOMContentLoaded", function () {
        setupNav();
        setupSearch();
        setupHero();
    });
}());
