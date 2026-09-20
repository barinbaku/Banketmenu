(function () {
  "use strict";

  function slug(idx) {
    return "pkg-" + idx;
  }

  function esc(s) {
    if (!s) return "";
    return s.replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function renderItem(item) {
    var azHtml = item.az ? '<span class="item-az">' + esc(item.az) + "</span>" : "";
    return '<li><span class="item-ru">' + esc(item.ru) + "</span>" + azHtml + "</li>";
  }

  function renderSection(sec) {
    var items = sec.items.map(renderItem).join("");
    return (
      '<div class="pkg-sec">' +
      '<div class="pkg-sec-head">' +
      '<div class="pkg-sec-ru">' + esc(sec.title_ru) + "</div>" +
      '<span class="pkg-sec-az">' + esc(sec.title_az) + "</span>" +
      "</div>" +
      '<div class="pkg-sec-rule"></div>' +
      '<ul class="pkg-list">' + items + "</ul>" +
      "</div>"
    );
  }

  function renderPackage(pkg, idx) {
    var half = Math.ceil(pkg.sections.length / 2);
    var colA = pkg.sections.slice(0, half).map(renderSection).join("");
    var colB = pkg.sections.slice(half).map(renderSection).join("");
    return (
      '<section class="package" id="' + slug(idx) + '">' +
      '<div class="pkg-head">' +
      '<div class="pkg-eyebrow">Банкетное меню &middot; Ziyafət menyusu</div>' +
      '<div class="pkg-title">' + esc(pkg.title_ru) + "</div>" +
      '<div class="price-line">' +
      '<span class="rule"></span>' +
      '<span class="price-num">' + esc(pkg.price) + "</span>" +
      '<span class="price-unit">AZN</span>' +
      '<span class="rule"></span>' +
      "</div>" +
      '<div class="price-caption">на человека / bir nəfərə</div>' +
      "</div>" +
      '<div class="pkg-columns">' +
      '<div class="pkg-col">' + colA + "</div>" +
      '<div class="pkg-col">' + colB + "</div>" +
      "</div>" +
      '<div class="pkg-service">+10% от суммы чека взимается за сервис</div>' +
      "</section>"
    );
  }

  function renderNav(data) {
    var track = document.getElementById("pkgnavTrack");
    track.innerHTML = data
      .map(function (pkg, idx) {
        return (
          '<button data-target="' + slug(idx) + '">' + esc(pkg.title_ru) + "</button>"
        );
      })
      .join("");
  }

  function initScrollSpy(data) {
    var buttons = Array.prototype.slice.call(
      document.querySelectorAll(".pkgnav-track button")
    );
    var sections = data.map(function (pkg, idx) {
      return document.getElementById(slug(idx));
    });

    buttons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var target = document.getElementById(btn.getAttribute("data-target"));
        if (target) {
          var y = target.getBoundingClientRect().top + window.scrollY - 60;
          window.scrollTo({ top: y, behavior: "smooth" });
        }
      });
    });

    function setActive(id) {
      buttons.forEach(function (b) {
        b.classList.toggle("active", b.getAttribute("data-target") === id);
      });
      var activeBtn = document.querySelector(".pkgnav-track button.active");
      if (activeBtn) {
        activeBtn.scrollIntoView({
          behavior: "smooth",
          inline: "center",
          block: "nearest",
        });
      }
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          }
        });
      },
      { rootMargin: "-30% 0px -60% 0px", threshold: 0 }
    );
    sections.forEach(function (s) {
      if (s) observer.observe(s);
    });

    if (buttons.length) setActive(buttons[0].getAttribute("data-target"));
  }

  function initToTop() {
    var btn = document.getElementById("toTop");
    window.addEventListener("scroll", function () {
      btn.classList.toggle("visible", window.scrollY > 500);
    });
    btn.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  function init() {
    var data = window.BANQUET_DATA || [];
    var main = document.getElementById("packages");
    main.innerHTML = data.map(renderPackage).join("");
    renderNav(data);
    initScrollSpy(data);
    initToTop();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
