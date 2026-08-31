/* ==========================================================================
   Zoe Homan — portfolio
   Two behaviours: reveal-on-scroll, and active-section tracking in the
   case-study nav. No dependencies, no build step.
   ========================================================================== */

(function () {
  "use strict";

  var reduceMotion = window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ------------------------------------------------ reveal on scroll -- */

  var revealables = document.querySelectorAll(".reveal");

  if (!revealables.length) {
    // nothing to do
  } else if (reduceMotion || !("IntersectionObserver" in window)) {
    // Show everything immediately rather than leaving content invisible.
    Array.prototype.forEach.call(revealables, function (el) {
      el.classList.add("is-in");
    });
  } else {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 }
    );

    Array.prototype.forEach.call(revealables, function (el) {
      revealObserver.observe(el);
    });
  }

  /* ------------------------------------- case-study active section -- */

  var casenav = document.getElementById("casenav");
  if (!casenav) return;

  var links = Array.prototype.slice.call(casenav.querySelectorAll("a[href^='#']"));
  if (!links.length) return;

  var sections = links
    .map(function (link) {
      var el = document.getElementById(link.getAttribute("href").slice(1));
      return el ? { link: link, el: el } : null;
    })
    .filter(Boolean);

  if (!sections.length) return;

  function setActive(entry) {
    links.forEach(function (l) { l.classList.remove("is-active"); });
    entry.link.classList.add("is-active");
  }

  function currentByPosition() {
    // Offset by the two stacked sticky bars so the highlighted item matches
    // whatever is actually under them.
    var line = (parseFloat(getComputedStyle(document.documentElement)
      .getPropertyValue("--bar-h")) || 44) + casenav.offsetHeight + 24;

    var active = sections[0];
    sections.forEach(function (s) {
      if (s.el.getBoundingClientRect().top <= line) active = s;
    });

    // At the very bottom of the page the last section may never cross the
    // line, so pin it explicitly.
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 4) {
      active = sections[sections.length - 1];
    }
    return active;
  }

  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(function () {
      setActive(currentByPosition());
      ticking = false;
    });
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  onScroll();
})();
