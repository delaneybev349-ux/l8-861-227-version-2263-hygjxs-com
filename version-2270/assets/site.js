(function () {
    function ready(fn) {
        if (document.readyState !== "loading") {
            fn();
            return;
        }
        document.addEventListener("DOMContentLoaded", fn);
    }

    ready(function () {
        var header = document.querySelector("[data-site-header]");
        var toggle = document.querySelector("[data-mobile-toggle]");
        var hero = document.querySelector("[data-hero]");
        var searchForms = document.querySelectorAll("[data-search-form]");
        var localSearchForms = document.querySelectorAll("[data-local-search]");

        function updateHeader() {
            if (!header) {
                return;
            }
            header.classList.toggle("is-scrolled", window.scrollY > 24);
        }

        updateHeader();
        window.addEventListener("scroll", updateHeader, { passive: true });

        if (toggle) {
            toggle.addEventListener("click", function () {
                document.body.classList.toggle("is-menu-open");
            });
        }

        document.querySelectorAll(".mobile-panel a").forEach(function (link) {
            link.addEventListener("click", function () {
                document.body.classList.remove("is-menu-open");
            });
        });

        searchForms.forEach(function (form) {
            form.addEventListener("submit", function (event) {
                event.preventDefault();
                var input = form.querySelector("input[type='search']");
                var value = input ? input.value.trim() : "";
                if (value) {
                    window.location.href = "./search.html?q=" + encodeURIComponent(value);
                } else {
                    window.location.href = "./search.html";
                }
            });
        });

        function applyLocalSearch(input, root) {
            var query = (input.value || "").trim().toLowerCase();
            var cards = Array.prototype.slice.call(root.querySelectorAll("[data-search-card]"));
            var empty = root.querySelector("[data-empty-state]");
            var shown = 0;

            cards.forEach(function (card) {
                var text = (card.getAttribute("data-search-text") || "").toLowerCase();
                var matched = !query || text.indexOf(query) !== -1;
                card.hidden = !matched;
                if (matched) {
                    shown += 1;
                }
            });

            if (empty) {
                empty.hidden = shown !== 0;
            }
        }

        localSearchForms.forEach(function (form) {
            var input = form.querySelector("[data-search-input]");
            var root = form.closest(".section-inner") || document;
            if (!input) {
                return;
            }
            form.addEventListener("submit", function (event) {
                event.preventDefault();
                applyLocalSearch(input, root);
            });
            input.addEventListener("input", function () {
                applyLocalSearch(input, root);
            });
            var params = new URLSearchParams(window.location.search);
            var query = params.get("q");
            if (query) {
                input.value = query;
                applyLocalSearch(input, root);
            }
        });

        if (hero) {
            var slides = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-slide]"));
            var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
            var activeIndex = 0;
            var timer = null;

            function showSlide(index) {
                if (!slides.length) {
                    return;
                }
                activeIndex = (index + slides.length) % slides.length;
                slides.forEach(function (slide, slideIndex) {
                    slide.classList.toggle("is-active", slideIndex === activeIndex);
                });
                dots.forEach(function (dot, dotIndex) {
                    dot.classList.toggle("is-active", dotIndex === activeIndex);
                });
            }

            function startHero() {
                stopHero();
                timer = window.setInterval(function () {
                    showSlide(activeIndex + 1);
                }, 5800);
            }

            function stopHero() {
                if (timer) {
                    window.clearInterval(timer);
                    timer = null;
                }
            }

            dots.forEach(function (dot, index) {
                dot.addEventListener("click", function () {
                    showSlide(index);
                    startHero();
                });
            });

            hero.addEventListener("mouseenter", stopHero);
            hero.addEventListener("mouseleave", startHero);
            showSlide(0);
            startHero();
        }
    });
}());
