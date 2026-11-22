(function () {
  'use strict';

  function initGallery() {
    var page = document.querySelector('.review-page');
    if (!page) return;
    var mainLink = page.querySelector('a.product-main-image');
    var mainImg = mainLink && mainLink.querySelector('img');
    if (!mainLink || !mainImg) return;

    var thumbs = Array.prototype.slice.call(page.querySelectorAll('.product-gallery a.gallery-thumb'));
    var items = [];
    function absolute(url) {
      try { return new URL(url, document.baseURI).href; } catch (_) { return url; }
    }
    function add(url, alt, caption) {
      if (!url) return;
      url = absolute(url);
      if (items.some(function (x) { return x.url === url; })) return;
      items.push({url:url, alt:alt || mainImg.alt || 'Foto do produto', caption:caption || ''});
    }
    add(mainImg.currentSrc || mainImg.src || mainLink.href, mainImg.alt, '');
    thumbs.forEach(function (a) {
      var img = a.querySelector('img');
      if (img) add(a.href || img.currentSrc || img.src, img.alt, (a.querySelector('span') || {}).textContent || '');
    });
    if (!items.length) return;

    var active = 0, overlay, lbImg, lbCaption, prev, next, close;
    function setActive(index) {
      active = (index + items.length) % items.length;
      var item = items[active];
      mainImg.src = item.url;
      mainLink.href = item.url;
      thumbs.forEach(function (a) {
        var selected = absolute(a.href) === item.url;
        a.classList.toggle('is-active', selected);
        if (selected) a.setAttribute('aria-current', 'true');
        else a.removeAttribute('aria-current');
      });
      if (overlay) {
        lbImg.src = item.url;
        lbImg.alt = item.alt;
        lbCaption.textContent = item.caption || item.alt || '';
        prev.hidden = next.hidden = items.length < 2;
      }
    }
    function closeBox() {
      if (!overlay) return;
      overlay.classList.remove('is-open');
      document.body.classList.remove('grt-lightbox-open');
      mainLink.focus({preventScroll:true});
    }
    function buildBox() {
      if (overlay) return;
      overlay = document.createElement('div');
      overlay.className = 'grt-lightbox';
      overlay.setAttribute('role','dialog');
      overlay.setAttribute('aria-modal','true');
      overlay.setAttribute('aria-label','Galeria de fotos do produto');
      overlay.innerHTML = '<button class="grt-lightbox__close" type="button" aria-label="Fechar">×</button>' +
        '<button class="grt-lightbox__nav grt-lightbox__nav--prev" type="button" aria-label="Foto anterior">‹</button>' +
        '<figure class="grt-lightbox__figure"><img class="grt-lightbox__image" alt=""><figcaption class="grt-lightbox__caption"></figcaption></figure>' +
        '<button class="grt-lightbox__nav grt-lightbox__nav--next" type="button" aria-label="Próxima foto">›</button>';
      document.body.appendChild(overlay);
      lbImg = overlay.querySelector('.grt-lightbox__image');
      lbCaption = overlay.querySelector('.grt-lightbox__caption');
      close = overlay.querySelector('.grt-lightbox__close');
      prev = overlay.querySelector('.grt-lightbox__nav--prev');
      next = overlay.querySelector('.grt-lightbox__nav--next');
      close.addEventListener('click', closeBox);
      prev.addEventListener('click', function(){setActive(active - 1);});
      next.addEventListener('click', function(){setActive(active + 1);});
      overlay.addEventListener('click', function(e){if(e.target === overlay) closeBox();});
      document.addEventListener('keydown', function(e) {
        if (!overlay.classList.contains('is-open')) return;
        if (e.key === 'Escape') closeBox();
        else if (e.key === 'ArrowLeft') setActive(active - 1);
        else if (e.key === 'ArrowRight') setActive(active + 1);
      });
    }
    function open(index) {
      buildBox();
      setActive(index);
      overlay.classList.add('is-open');
      document.body.classList.add('grt-lightbox-open');
      close.focus({preventScroll:true});
    }

    mainLink.removeAttribute('target');
    mainLink.setAttribute('role','button');
    mainLink.setAttribute('aria-label','Ampliar imagem do produto');
    mainLink.addEventListener('click', function(e) {
      e.preventDefault();
      var idx = items.findIndex(function(x){return x.url === absolute(mainLink.href);});
      open(idx < 0 ? active : idx);
    });
    thumbs.forEach(function(a) {
      a.removeAttribute('target');
      a.addEventListener('click', function(e) {
        e.preventDefault();
        var idx = items.findIndex(function(x){return x.url === absolute(a.href);});
        if (idx >= 0) open(idx);
      });
    });
    setActive(0);
  }

  function fixStars() {
    document.querySelectorAll('.review-page .store-rating').forEach(function(rating) {
      var stars = rating.querySelector('.stars');
      var filled = rating.querySelector('.stars-filled');
      if (!stars || !filled) return;
      var m = (rating.getAttribute('aria-label') || '').match(/Avaliação\\s+(\\d+(?:[.,]\\d+)?)\\s+de\\s+5/i);
      var value = m ? Number(m[1].replace(',', '.')) : NaN;
      if (!Number.isFinite(value)) {
        var text = (rating.querySelector('.rating-number') || {}).textContent || '';
        m = text.match(/(\\d+(?:[.,]\\d+)?)\\s*\\/\\s*5/);
        if (m) value = Number(m[1].replace(',', '.'));
      }
      if (!Number.isFinite(value)) return;
      value = Math.max(0, Math.min(5, value));
      filled.style.width = (value * 20) + '%';
      filled.style.maxWidth = '100%';
      stars.setAttribute('aria-label', value + ' de 5 estrelas');
    });
  }

  function start() { initGallery(); fixStars(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
}());
