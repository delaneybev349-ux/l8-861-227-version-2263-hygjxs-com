(function () {
  const toggle = document.querySelector(".menu-toggle");
  const mobile = document.querySelector(".mobile-nav");

  if (toggle && mobile) {
    toggle.addEventListener("click", function () {
      const isOpen = mobile.hasAttribute("hidden");
      if (isOpen) {
        mobile.removeAttribute("hidden");
        toggle.setAttribute("aria-expanded", "true");
      } else {
        mobile.setAttribute("hidden", "");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  const slider = document.querySelector("[data-hero-slider]");
  if (slider) {
    const slides = Array.from(slider.querySelectorAll(".hero-slide"));
    const dots = Array.from(slider.querySelectorAll("[data-hero-dot]"));
    let index = 0;

    const show = function (next) {
      index = (next + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle("is-active", i === index);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle("is-active", i === index);
      });
    };

    dots.forEach(function (dot, i) {
      dot.addEventListener("click", function () {
        show(i);
      });
    });

    if (slides.length > 1) {
      window.setInterval(function () {
        show(index + 1);
      }, 5200);
    }
  }

  const scopes = Array.from(document.querySelectorAll("[data-filter-scope]"));
  scopes.forEach(function (scope) {
    const input = scope.querySelector("[data-inline-filter]");
    const cards = Array.from(scope.querySelectorAll(".movie-card"));
    const buttons = Array.from(scope.querySelectorAll("[data-filter-value]"));
    let active = "all";

    const params = new URLSearchParams(window.location.search);
    const q = params.get("q") || "";
    if (q && input) {
      input.value = q;
    }

    const apply = function () {
      const term = input ? input.value.trim().toLowerCase() : "";
      cards.forEach(function (card) {
        const haystack = (card.getAttribute("data-search") || "").toLowerCase();
        const type = card.getAttribute("data-type") || "";
        const matchTerm = !term || haystack.indexOf(term) !== -1;
        const matchActive = active === "all" || haystack.indexOf(active.toLowerCase()) !== -1 || type === active;
        card.classList.toggle("is-hidden", !(matchTerm && matchActive));
      });
    };

    if (input) {
      input.addEventListener("input", apply);
    }

    buttons.forEach(function (button) {
      button.addEventListener("click", function () {
        active = button.getAttribute("data-filter-value") || "all";
        buttons.forEach(function (item) {
          item.classList.toggle("is-active", item === button);
        });
        apply();
      });
    });

    apply();
  });
})();
