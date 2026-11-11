(function () {
  'use strict';
  function initStickyOffers() {
    var bar = document.getElementById('sticky-offers');
    var original = document.getElementById('original-offers-panel');
    var close = document.getElementById('sticky-offers-close');
    if (!bar || !original) return;
    var dismissed = false;
    var originalVisible = true;
    function update() {
      var pastTop = window.scrollY > Math.max(180, original.offsetTop + original.offsetHeight - window.innerHeight * 0.35);
      var show = !dismissed && !originalVisible && pastTop;
      bar.classList.toggle('is-visible', show);
      bar.setAttribute('aria-hidden', show ? 'false' : 'true');
    }
    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(function (entries) {
        originalVisible = entries[0].isIntersecting;
        update();
      }, { threshold: 0.05 });
      observer.observe(original);
    } else {
      originalVisible = false;
      window.addEventListener('scroll', function () {
        var rect = original.getBoundingClientRect();
        originalVisible = rect.bottom > 0 && rect.top < window.innerHeight;
        update();
      }, { passive: true });
    }
    if (close) close.addEventListener('click', function () {
      dismissed = true;
      bar.classList.remove('is-visible');
      bar.setAttribute('aria-hidden', 'true');
    });
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initStickyOffers);
  else initStickyOffers();
}());
