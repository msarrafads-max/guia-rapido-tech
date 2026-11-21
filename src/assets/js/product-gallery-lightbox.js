(function(){
"use strict";
function initStars(){
 document.querySelectorAll(".review-page .stars").forEach(function(stars){
  var filled=stars.querySelector(".stars-filled"); if(!filled)return;
  var style=filled.getAttribute("style")||"",m=style.match(/width\s*:\s*([\d.]+)\s*%/i),pct;
  if(m)pct=Math.max(0,Math.min(100,parseFloat(m[1])));
  else{
   var txt=[stars.getAttribute("data-rating"),stars.getAttribute("aria-label"),stars.getAttribute("title"),stars.parentElement?stars.parentElement.textContent:""].filter(Boolean).join(" ");
   var r=txt.match(/([0-5](?:[.,]\d+)?)\s*(?:\/\s*5|de\s*5)/i);
   pct=r?Math.max(0,Math.min(100,parseFloat(r[1].replace(",","."))*20)):100;
  }
  filled.style.setProperty("--rating-percent",pct+"%");filled.setAttribute("aria-hidden","true");
 });
}
function initGallery(){
 var wrap=document.querySelector(".review-page .product-gallery-wrap");if(!wrap)return;
 var main=wrap.querySelector("a.product-main-image"),thumbs=[].slice.call(wrap.querySelectorAll(".product-gallery a.gallery-thumb")),links=[];
 if(main&&main.querySelector("img"))links.push(main);
 thumbs.forEach(function(a){if(a.querySelector("img"))links.push(a)});if(!links.length)return;
 var items=links.map(function(a){var im=a.querySelector("img"),cap=a.querySelector("span");return{src:a.getAttribute("href")||im.currentSrc||im.src,alt:im.alt||document.title,caption:cap?cap.textContent.trim():""}});
 var current=0,oldFocus=null,modal=document.createElement("div");
 modal.className="grt-gallery-lightbox";modal.hidden=true;modal.setAttribute("role","dialog");modal.setAttribute("aria-modal","true");modal.setAttribute("aria-label","Galeria de imagens do produto");
 modal.innerHTML='<div class="grt-lightbox-top"><span class="grt-lightbox-count" aria-live="polite"></span><button type="button" class="grt-lightbox-close" aria-label="Fechar galeria">×</button></div><div class="grt-lightbox-stage"><button type="button" class="grt-lightbox-arrow grt-lightbox-prev" aria-label="Imagem anterior">‹</button><div class="grt-lightbox-image-wrap"><img class="grt-lightbox-image" alt=""></div><button type="button" class="grt-lightbox-arrow grt-lightbox-next" aria-label="Próxima imagem">›</button></div><div class="grt-lightbox-bottom"><span class="grt-lightbox-hint">Use ← e → para navegar</span><div class="grt-lightbox-caption"></div><span class="grt-lightbox-hint"></span></div>';
 document.body.appendChild(modal);
 var image=modal.querySelector(".grt-lightbox-image"),count=modal.querySelector(".grt-lightbox-count"),caption=modal.querySelector(".grt-lightbox-caption"),closeBtn=modal.querySelector(".grt-lightbox-close"),prev=modal.querySelector(".grt-lightbox-prev"),next=modal.querySelector(".grt-lightbox-next");
 function render(){var it=items[current];image.src=it.src;image.alt=it.alt;count.textContent=(current+1)+" / "+items.length;caption.textContent=it.caption||it.alt||"";prev.hidden=next.hidden=items.length<2}
 function openAt(i,trigger){current=(i+items.length)%items.length;oldFocus=trigger||document.activeElement;render();modal.hidden=false;document.documentElement.classList.add("grt-lightbox-open");closeBtn.focus()}
 function close(){if(modal.hidden)return;modal.hidden=true;document.documentElement.classList.remove("grt-lightbox-open");if(oldFocus&&oldFocus.focus)oldFocus.focus()}
 function move(d){if(items.length<2)return;current=(current+d+items.length)%items.length;render()}
 links.forEach(function(a,i){a.setAttribute("aria-haspopup","dialog");a.addEventListener("click",function(e){e.preventDefault();openAt(i,a)})});
 closeBtn.addEventListener("click",close);prev.addEventListener("click",function(){move(-1)});next.addEventListener("click",function(){move(1)});
 modal.addEventListener("click",function(e){if(e.target===modal)close()});
 document.addEventListener("keydown",function(e){if(modal.hidden)return;if(e.key==="Escape"){e.preventDefault();close()}else if(e.key==="ArrowLeft"){e.preventDefault();move(-1)}else if(e.key==="ArrowRight"){e.preventDefault();move(1)}else if(e.key==="Tab"){var b=[].slice.call(modal.querySelectorAll("button:not([hidden])")),f=b[0],l=b[b.length-1];if(e.shiftKey&&document.activeElement===f){e.preventDefault();l.focus()}else if(!e.shiftKey&&document.activeElement===l){e.preventDefault();f.focus()}}});
}
function init(){initStars();initGallery()}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init);else init();
})();