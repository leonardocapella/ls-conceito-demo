/* LS Conceito: vitrine. A compra acontece na loja online (Nuvemshop). */
(function () {
  "use strict";
  var CFG = window.LS_CONFIG || {};
  var STORE = window.LS_STORE;
  var PRODUCTS = STORE.PRODUCTS;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var hasGsap = typeof gsap !== "undefined";
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function img(i) { return "img/p" + i + ".jpg"; }
  function byId(id) { return PRODUCTS.filter(function (p) { return p.id === id; })[0]; }
  function waLink(text) { return "https://wa.me/" + CFG.whatsapp + "?text=" + encodeURIComponent(text); }
  function buyUrl(p) { return (p && p.url) || CFG.loja || ""; }

  /* ---------- Rastreamento (GA4 / Meta Pixel / GTM) ---------- */
  window.dataLayer = window.dataLayer || [];
  function loadScript(src) { var s = document.createElement("script"); s.async = true; s.src = src; document.head.appendChild(s); }
  if (CFG.ga4) {
    loadScript("https://www.googletagmanager.com/gtag/js?id=" + CFG.ga4);
    window.gtag = function () { window.dataLayer.push(arguments); };
    gtag("js", new Date()); gtag("config", CFG.ga4);
  }
  if (CFG.gtm) {
    window.dataLayer.push({ "gtm.start": Date.now(), event: "gtm.js" });
    loadScript("https://www.googletagmanager.com/gtm.js?id=" + CFG.gtm);
  }
  if (CFG.metaPixel) {
    !function (f, b, e, v, n, t, s) { if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); }; if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = "2.0"; n.queue = []; t = b.createElement(e); t.async = !0; t.src = v; s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s); }(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");
    fbq("init", CFG.metaPixel); fbq("track", "PageView");
  }
  var FB_MAP = { view_item: "ViewContent", click_comprar: "InitiateCheckout" };
  function track(name, p) {
    p = p || {};
    if (window.gtag) gtag("event", name, p);
    if (CFG.gtm) window.dataLayer.push(Object.assign({ event: name }, p));
    if (window.fbq && FB_MAP[name]) fbq("track", FB_MAP[name], { content_name: p.item_name });
  }

  /* ---------- Links de WhatsApp e ano ---------- */
  $$(".js-whats").forEach(function (a) {
    a.href = waLink("Olá! Vim pelo site da LS Conceito e gostaria de ajuda.");
    a.target = "_blank"; a.rel = "noopener";
  });
  $("#year").textContent = new Date().getFullYear();

  /* ---------- Aviso (toast) ---------- */
  var toastT;
  function toast(msg) {
    var t = $("#toast"); t.textContent = msg;
    if (hasGsap) { gsap.killTweensOf(t); gsap.fromTo(t, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: .45, ease: "power3.out" }); clearTimeout(toastT); toastT = setTimeout(function () { gsap.to(t, { opacity: 0, y: 40, duration: .4 }); }, 3200); }
    else { t.style.opacity = 1; t.style.transform = "translate(-50%,0)"; clearTimeout(toastT); toastT = setTimeout(function () { t.style.opacity = 0; }, 3200); }
  }

  /* ---------- Faixa de avisos do topo ---------- */
  (function () {
    var avisos = CFG.avisos && CFG.avisos.length ? CFG.avisos : ["Enviamos para todo o Brasil"];
    var el = $("#topbarMsg"), i = 0;
    el.textContent = avisos[0];
    if (avisos.length < 2) return;
    setInterval(function () {
      i = (i + 1) % avisos.length;
      if (!hasGsap) { el.textContent = avisos[i]; return; }
      gsap.to(el, { yPercent: -100, opacity: 0, duration: .35, ease: "power2.in", onComplete: function () {
        el.textContent = avisos[i];
        gsap.fromTo(el, { yPercent: 100, opacity: 0 }, { yPercent: 0, opacity: 1, duration: .45, ease: "power3.out" });
      } });
    }, 3800);
  })();

  /* ---------- Botões "Comprar na loja" ---------- */
  function buyLink(a, p) {
    var url = buyUrl(p);
    a.href = url || "#";
    if (url) { a.target = "_blank"; a.rel = "noopener"; } else { a.removeAttribute("target"); }
  }
  document.addEventListener("click", function (e) {
    var a = e.target.closest("[data-buy]");
    if (!a) return;
    var p = a.dataset.buy ? byId(a.dataset.buy) : null;
    var url = buyUrl(p);
    track("click_comprar", { item_name: p ? p.name : "loja" });
    if (!url) { e.preventDefault(); toast("Na versão final, este botão leva para a loja online."); }
    else if (a.getAttribute("href") !== url) { e.preventDefault(); window.open(url, "_blank", "noopener"); }
  });
  $$("[data-buy='']").forEach(function (a) { buyLink(a, null); });

  /* ---------- Scroll suave (Lenis) ---------- */
  var lenis = null;
  if (typeof Lenis !== "undefined" && hasGsap && !reduce) {
    lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 1 });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
    gsap.ticker.lagSmoothing(0);
  }
  function lock(on) {
    if (lenis) on ? lenis.stop() : lenis.start();
    document.documentElement.style.overflow = on ? "hidden" : "";
  }
  function scrollToEl(el) {
    if (lenis) lenis.scrollTo(el, { offset: -70, duration: 1.4 });
    else el.scrollIntoView({ behavior: "smooth" });
  }
  document.addEventListener("click", function (e) {
    var a = e.target.closest('a[href^="#"]');
    if (!a || a.getAttribute("href") === "#" || a.hasAttribute("data-buy")) return;
    var t = $(a.getAttribute("href"));
    if (!t) return;
    e.preventDefault(); scrollToEl(t);
    $("#nav").classList.remove("is-open"); $("#burger").classList.remove("is-open");
  });
  $("#burger").addEventListener("click", function () {
    this.classList.toggle("is-open"); $("#nav").classList.toggle("is-open");
  });

  /* ---------- Cabeçalho ---------- */
  var header = $("#header");
  window.addEventListener("scroll", function () { header.classList.toggle("is-scrolled", window.scrollY > 40); }, { passive: true });

  /* ---------- Catálogo ---------- */
  var grid = $("#grid");
  var lastCat = null;
  PRODUCTS.forEach(function (p) {
    if (p.cat !== lastCat) {
      lastCat = p.cat;
      var hd = document.createElement("div");
      hd.className = "grid-head"; hd.dataset.cat = p.cat; hd.id = "cat-" + p.cat;
      hd.innerHTML = '<h3>' + STORE.CATS_PLURAL[p.cat] + '</h3><span class="grid-count"></span>';
      grid.appendChild(hd);
    }
    var el = document.createElement("article");
    el.className = "card"; el.dataset.cat = p.cat; el.dataset.brand = p.brand; el.dataset.id = p.id;
    el.innerHTML =
      '<button class="card-media" data-open="' + p.id + '" aria-label="Ver ' + esc(p.name) + '">' +
      (p.tag ? '<span class="card-tag">' + esc(p.tag) + "</span>" : "") +
      '<img src="' + img(p.imgs[0]) + '" alt="' + esc(p.name) + '" loading="lazy">' +
      (p.imgs[1] !== undefined ? '<img class="alt" src="' + img(p.imgs[1]) + '" alt="" loading="lazy">' : "") +
      '<span class="card-quick">Ver fotos</span></button>' +
      '<div class="card-body"><span class="card-cat">' + esc(p.brand) + " · " + STORE.CATS[p.cat] + "</span><h3>" + esc(p.name) + "</h3>" +
      '<button class="card-btn" data-open="' + p.id + '">Comprar <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M13 6l6 6-6 6"/></svg></button></div>';
    grid.appendChild(el);
  });
  grid.addEventListener("click", function (e) {
    var b = e.target.closest("[data-open]"); if (b) openProduct(b.dataset.open);
  });

  /* Filtros combinados: categoria + marca */
  var curCat = "todos", curBrand = "todas";
  var brandBox = $("#brandFilters");
  var brandsUsed = STORE.BRANDS.filter(function (b) { return PRODUCTS.some(function (p) { return p.brand === b; }); });
  brandBox.innerHTML = '<button class="chip is-active" data-brand="todas">Todas as marcas</button>' +
    brandsUsed.map(function (b) { return '<button class="chip" data-brand="' + esc(b) + '">' + esc(b) + "</button>"; }).join("");
  function applyFilter(f, b) {
    if (f !== undefined && f !== null) curCat = f;
    if (b !== undefined && b !== null) curBrand = b;
    function has(cat, brand) {
      return PRODUCTS.some(function (p) { return (cat === "todos" || p.cat === cat) && (brand === "todas" || p.brand === brand); });
    }
    /* se a combinação não existe, o filtro que acabou de ser escolhido vence e o outro volta para "todos" */
    if (!has(curCat, curBrand)) { if (b !== undefined && b !== null && (f === undefined || f === null)) curCat = "todos"; else curBrand = "todas"; }
    /* mostra só as opções que têm peça na seleção atual */
    $$("#filters .chip").forEach(function (c) { c.hidden = !has(c.dataset.filter, curBrand); });
    $$("#brandFilters .chip").forEach(function (c) { c.hidden = !has(curCat, c.dataset.brand); });
    $$("#filters .chip").forEach(function (c) { c.classList.toggle("is-active", c.dataset.filter === curCat); });
    $$("#brandFilters .chip").forEach(function (c) { c.classList.toggle("is-active", c.dataset.brand === curBrand); });
    var cards = $$(".card");
    var show = cards.filter(function (c) {
      return (curCat === "todos" || c.dataset.cat === curCat) && (curBrand === "todas" || c.dataset.brand === curBrand);
    });
    $("#emptyMsg").hidden = show.length > 0;
    $$(".grid-head").forEach(function (h) {
      var n = show.filter(function (c) { return c.dataset.cat === h.dataset.cat; }).length;
      h.style.display = n ? "" : "none";
      h.querySelector(".grid-count").textContent = n + (n === 1 ? " peça" : " peças");
    });
    function swap() {
      cards.forEach(function (c) { c.style.display = show.indexOf(c) > -1 ? "" : "none"; });
      if (hasGsap) gsap.fromTo(show, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: .55, stagger: .04, ease: "power3.out", overwrite: true, onComplete: function () { ScrollTrigger.refresh(); } });
    }
    if (hasGsap) gsap.to(cards.filter(function (c) { return c.style.display !== "none"; }), { opacity: 0, y: 20, duration: .2, onComplete: swap }); else swap();
  }
  $("#filters").addEventListener("click", function (e) {
    var c = e.target.closest(".chip"); if (c) applyFilter(c.dataset.filter, null);
  });
  brandBox.addEventListener("click", function (e) {
    var c = e.target.closest(".chip"); if (c) applyFilter(null, c.dataset.brand);
  });
  $$("a[data-filter]").forEach(function (c) { c.addEventListener("click", function () { applyFilter(c.dataset.filter, "todas"); }); });

  /* ---------- Modal do produto ---------- */
  var modal = $("#modal"), cur = null, curSize = null;
  function sizesFor(p) { return p.sizes || (p.cat === "bones" ? ["Único"] : ["P", "M", "G", "GG"]); }
  /* Link que coloca a variação (tamanho) escolhida no carrinho da Nuvemshop */
  function variantUrl(p, size) {
    var id = p.variants && p.variants[size];
    return id && CFG.loja ? CFG.loja.replace(/\/$/, "") + "/comprar/" + id + "-1/" : "";
  }
  function openLayer(layer, card) {
    layer.classList.add("is-open"); layer.setAttribute("aria-hidden", "false"); lock(true);
    if (hasGsap) {
      gsap.fromTo($(".modal-bg", layer), { opacity: 0 }, { opacity: 1, duration: .35 });
      gsap.fromTo(card, { opacity: 0, y: 50, scale: .96 }, { opacity: 1, y: 0, scale: 1, duration: .55, ease: "power3.out" });
    } else { $(".modal-bg", layer).style.opacity = 1; card.style.opacity = 1; }
  }
  function closeLayer(layer, card) {
    function done() { layer.classList.remove("is-open"); layer.setAttribute("aria-hidden", "true"); lock(false); }
    if (hasGsap) { gsap.to($(".modal-bg", layer), { opacity: 0, duration: .3 }); gsap.to(card, { opacity: 0, y: 30, duration: .3, onComplete: done }); } else done();
  }
  function setMainImg(src) {
    var m = $("#mImg");
    if (!hasGsap) { m.src = src; return; }
    gsap.to(m, { opacity: 0, duration: .15, onComplete: function () { m.src = src; gsap.to(m, { opacity: 1, duration: .3 }); } });
  }
  function openProduct(id) {
    cur = byId(id);
    $("#mImg").src = img(cur.imgs[0]); $("#mImg").alt = cur.name;
    $("#mName").textContent = cur.name;
    $("#mCat").textContent = cur.brand + " · " + STORE.CATS[cur.cat];
    $("#mThumbs").innerHTML = cur.imgs.length > 1 ? cur.imgs.map(function (n, i) { return '<button type="button" class="' + (i ? "" : "is-active") + '" data-src="' + img(n) + '"><img src="' + img(n) + '" alt=""></button>'; }).join("") : "";
    var sizes = sizesFor(cur); curSize = sizes.length === 1 ? sizes[0] : null;
    $("#mSizes").innerHTML = sizes.map(function (s) { return '<button type="button" class="size' + (s === curSize ? " is-active" : "") + '" data-size="' + esc(s) + '">' + esc(s) + "</button>"; }).join("");
    $("#mBtn").href = waLink("Olá! Tenho uma dúvida sobre: " + cur.name);
    openLayer(modal, $(".modal-card", modal));
    track("view_item", { item_id: cur.id, item_name: cur.name });
  }
  $("#mThumbs").addEventListener("click", function (e) {
    var b = e.target.closest("button"); if (!b) return;
    $$("button", this).forEach(function (x) { x.classList.toggle("is-active", x === b); }); setMainImg(b.dataset.src);
  });
  $("#mSizes").addEventListener("click", function (e) {
    var b = e.target.closest(".size"); if (!b) return;
    curSize = b.dataset.size; $$(".size", this).forEach(function (x) { x.classList.toggle("is-active", x === b); });
  });
  $("#mBuy").addEventListener("click", function (e) {
    e.preventDefault();
    if (!curSize) {
      $$("#mSizes .size").forEach(function (s) { s.classList.remove("shake"); void s.offsetWidth; s.classList.add("shake"); });
      toast("Escolha o tamanho"); return;
    }
    var url = variantUrl(cur, curSize) || buyUrl(cur);
    track("click_comprar", { item_name: cur.name, size: curSize });
    if (!url) { toast("Na versão final, este botão leva para a loja online com o tamanho escolhido."); return; }
    window.open(url, "_blank", "noopener");
  });
  $$("[data-close]", modal).forEach(function (b) { b.addEventListener("click", function () { closeLayer(modal, $(".modal-card", modal)); }); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && modal.classList.contains("is-open")) closeLayer(modal, $(".modal-card", modal)); });

  /* ---------- Destaques (monta os slides) ---------- */
  var FEATURED = ["polo-azul-ceu-faixa-preta", "camiseta-dragao-vermelho", "conjunto-preto-laranja", "camiseta-swoosh-gigante"];
  var stage = $("#showStage");
  FEATURED.forEach(function (id, k) {
    var p = byId(id), s = document.createElement("article");
    s.className = "slide";
    s.innerHTML = '<div class="slide-img"><img src="' + img(p.imgs[0]) + '" alt="' + esc(p.name) + '"></div>' +
      '<div class="slide-info"><span class="slide-no">0' + (k + 1) + '</span><span class="tag">' + STORE.CATS[p.cat] + '</span><h3>' + esc(p.name) + '</h3>' +
      '<p>Escolha o tamanho e finalize a compra na nossa loja online, com frete pelo CEP.</p>' +
      '<div class="slide-actions"><button class="btn btn-gold" data-open="' + p.id + '"><span>Comprar</span></button></div></div>';
    stage.appendChild(s);
  });
  $("#showTotal").textContent = "0" + FEATURED.length;
  stage.addEventListener("click", function (e) { var b = e.target.closest("[data-open]"); if (b) openProduct(b.dataset.open); });

  /* ---------- Copiar cupom ---------- */
  var cb = $("#couponBtn");
  if (cb) cb.addEventListener("click", function () {
    var h = $("#couponHint");
    function ok() { h.textContent = "Copiado"; setTimeout(function () { h.textContent = "Copiar"; }, 2000); }
    if (navigator.clipboard) navigator.clipboard.writeText("LSOFF10").then(ok, ok); else ok();
  });

  /* ---------- Marca grande do rodapé (letras) ---------- */
  var fm = $("#footMark");
  fm.innerHTML = fm.textContent.split("").map(function (ch) { return '<span class="ch">' + (ch === " " ? "&nbsp;" : ch) + "</span>"; }).join("");

  /* =====================================================
     ANIMAÇÕES
     ===================================================== */
  function showSite() { document.body.classList.remove("is-loading"); var p = $("#pre"); if (p) p.style.display = "none"; }
  if (!hasGsap || reduce) { showSite(); return; }
  gsap.registerPlugin(ScrollTrigger);

  /* Estados iniciais do hero */
  gsap.set(".kicker, .lead, .hero-cta, .coupon, .seals", { opacity: 0, y: 20 });
  gsap.set(".hero .line-in", { yPercent: 110 });
  gsap.set(".hm", { clipPath: "inset(0 0 100% 0)" });
  gsap.set(".hero-lion", { opacity: 0, scale: 1.18, y: 30 });

  function intro() {
    document.body.classList.remove("is-loading");
    gsap.timeline({ defaults: { ease: "power3.out" } })
      .to(".hero-lion", { opacity: .09, scale: 1, y: 0, duration: 1.8, ease: "power4.out" })
      .to(".kicker", { opacity: 1, y: 0, duration: .7 }, "-=1.4")
      .to(".hero .line-in", { yPercent: 0, duration: 1, stagger: .12, ease: "power4.out" }, "-=.4")
      .to(".lead, .hero-cta, .coupon, .seals", { opacity: 1, y: 0, duration: .8, stagger: .1 }, "-=.6")
      .to(".hm", { clipPath: "inset(0 0 0% 0)", duration: 1.3, stagger: .15, ease: "power4.out" }, "-=1.1")
      .from(".hm img", { scale: 1.3, duration: 1.7, stagger: .15 }, "<");
  }

  /* Abertura */
  gsap.timeline({ onComplete: function () { var p = $("#pre"); if (p) p.style.display = "none"; } })
    .fromTo(".pre-logo", { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: .7, ease: "power3.out" })
    .to(".pre-bar i", { scaleX: 1, duration: .9, ease: "power2.inOut" }, "-=.3")
    .to(".pre-in", { opacity: 0, duration: .35 }, "+=.1")
    .to(".pre-panel", { yPercent: -100, duration: .9, ease: "power4.inOut" })
    .add(intro, "-=.45");

  /* Barra de progresso no cabeçalho */
  gsap.to("#progress", { scaleX: 1, ease: "none", scrollTrigger: { start: 0, end: "max", scrub: .2 } });

  /* Parallax do hero */
  gsap.to(".hm img", { yPercent: -8, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });
  gsap.to(".hero-lion", { y: 90, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });
  gsap.to(".hm2", { y: -34, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });
  gsap.to(".hero-text", { y: -40, opacity: .4, ease: "none", scrollTrigger: { trigger: ".hero", start: "40% top", end: "bottom top", scrub: true } });

  /* Faixa de texto: acelera e inverte conforme o scroll */
  var mq = gsap.to("#mqTrack", { xPercent: -50, ease: "none", duration: 30, repeat: -1 });
  var mqT;
  ScrollTrigger.create({
    start: 0, end: "max",
    onUpdate: function (self) {
      var dir = self.direction, boost = 1 + Math.min(Math.abs(self.getVelocity()) / 350, 5);
      gsap.to(mq, { timeScale: dir * boost, duration: .25, overwrite: true });
      clearTimeout(mqT);
      mqT = setTimeout(function () { gsap.to(mq, { timeScale: dir, duration: 1.2, overwrite: true }); }, 160);
    }
  });

  /* Títulos: revelados por máscara */
  $$(".reveal-h").forEach(function (el) {
    gsap.fromTo(el, { clipPath: "inset(0 0 100% 0)", y: 40 }, { clipPath: "inset(0 0 0% 0)", y: 0, duration: 1, ease: "power4.out", scrollTrigger: { trigger: el, start: "top 90%", once: true }, onComplete: function () { gsap.set(el, { clearProps: "clipPath,transform" }); } });
  });
  $$(".reveal").forEach(function (el) {
    gsap.from(el, { opacity: 0, y: 28, duration: .8, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 90%", once: true } });
  });
  gsap.from(".trust-grid > div", { opacity: 0, y: 18, stagger: .1, duration: .7, ease: "power3.out", scrollTrigger: { trigger: ".trust", start: "top 92%", once: true } });

  /* Imagens: cortina + zoom que assenta */
  $$(".img-reveal:not(.hm)").forEach(function (el, k) {
    var im = $("img", el), st = { trigger: el, start: "top 88%", once: true };
    gsap.fromTo(el, { clipPath: "inset(0 0 100% 0)" }, { clipPath: "inset(0 0 0% 0)", duration: 1.2, ease: "power4.out", delay: (k % 4) * .08, scrollTrigger: st, onComplete: function () { gsap.set(el, { clearProps: "clipPath" }); } });
    if (im) gsap.fromTo(im, { scale: 1.25 }, { scale: 1, duration: 1.7, ease: "power3.out", delay: (k % 4) * .08, scrollTrigger: st, onComplete: function () { gsap.set(im, { clearProps: "transform" }); } });
  });

  /* Destaques: seção fixa que troca de peça ao rolar (desktop) */
  var show = $(".show"), slides = $$(".slide"), mm = gsap.matchMedia();
  mm.add("(min-width: 901px)", function () {
    var n = slides.length;
    show.classList.add("is-pinned");
    gsap.set(slides.slice(1), { opacity: 0, y: 40 });
    var tl = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: {
        trigger: show, pin: ".show-pin", start: "top top", scrub: .7, anticipatePin: 1,
        end: function () { return "+=" + Math.round((n - 1) * window.innerHeight * .95); },
        onUpdate: function (self) {
          var idx = Math.min(n - 1, Math.round(self.progress * (n - 1)));
          $("#showIdx").textContent = "0" + (idx + 1);
          gsap.set("#showBar", { scaleX: self.progress });
          slides.forEach(function (s, k) { s.style.pointerEvents = k === idx ? "auto" : "none"; });
        }
      }
    });
    for (var k = 1; k < n; k++) {
      tl.to(slides[k - 1], { opacity: 0, y: -30, duration: .35 }, (k - 1) + .35)
        .fromTo(slides[k], { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: .4 }, (k - 1) + .72)
        .fromTo($("img", slides[k]), { scale: 1.15 }, { scale: 1, duration: .6 }, (k - 1) + .72);
    }
    return function () { show.classList.remove("is-pinned"); slides.forEach(function (s) { s.style.pointerEvents = ""; }); };
  });
  mm.add("(max-width: 900px)", function () {
    slides.forEach(function (s) {
      gsap.from(s, { opacity: 0, y: 40, duration: .9, ease: "power3.out", scrollTrigger: { trigger: s, start: "top 85%", once: true } });
    });
  });

  /* Cards do catálogo entram em sequência */
  gsap.set(".card", { opacity: 0, y: 36 });
  ScrollTrigger.batch(".card", { start: "top 94%", once: true, onEnter: function (b) { gsap.to(b, { opacity: 1, y: 0, stagger: .06, duration: .7, ease: "power3.out", overwrite: true }); } });

  /* Faixas de fotos andam com o scroll */
  gsap.fromTo(".look .r1 .look-track", { xPercent: 0 }, { xPercent: -32, ease: "none", scrollTrigger: { trigger: ".look", start: "top bottom", end: "bottom top", scrub: 1 } });
  gsap.fromTo(".look .r2 .look-track", { xPercent: -32 }, { xPercent: 0, ease: "none", scrollTrigger: { trigger: ".look", start: "top bottom", end: "bottom top", scrub: 1 } });

  /* A loja: fotos com parallax em sentidos opostos */
  gsap.fromTo(".am1 img", { yPercent: 0 }, { yPercent: -11, ease: "none", scrollTrigger: { trigger: ".about-media", start: "top bottom", end: "bottom top", scrub: true } });
  gsap.fromTo(".am2 img", { yPercent: -11 }, { yPercent: 0, ease: "none", scrollTrigger: { trigger: ".about-media", start: "top bottom", end: "bottom top", scrub: true } });

  /* Passos: linha que se desenha */
  gsap.to("#stepsLine", { scaleX: 1, ease: "none", scrollTrigger: { trigger: ".steps-grid", start: "top 78%", end: "bottom 70%", scrub: true } });
  ScrollTrigger.batch(".step", { start: "top 88%", once: true, onEnter: function (b) {
    gsap.from(b, { opacity: 0, y: 30, stagger: .12, duration: .8, ease: "power3.out" });
    b.forEach(function (s, k) { setTimeout(function () { s.classList.add("is-on"); }, 250 + k * 130); });
  } });

  /* Marca do rodapé */
  gsap.from("#footMark .ch", { yPercent: 100, opacity: 0, stagger: .045, duration: 1.1, ease: "power4.out", scrollTrigger: { trigger: "#footMark", start: "top 98%", once: true } });

  window.addEventListener("load", function () { ScrollTrigger.refresh(); });
})();
