/* LS Conceito: vitrine. Carrinho de demonstração (mock do fluxo da Nuvemshop); o checkout roda na Nuvemshop. */
(function () {
  "use strict";
  var CFG = window.LS_CONFIG || {};
  var STORE = window.LS_STORE;
  var PRODUCTS = STORE.PRODUCTS;
  var PRICES = window.LS_PRICES || {};
  var PLACEHOLDER = window.LS_PRICE_PLACEHOLDER || {
    placeholder: true,
    label: "Preço a confirmar",
    parcelasLabel: "Parcelamento a confirmar"
  };
  var MAX_PARC = CFG.parcelasMax || 12;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var REDUCE = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  /* foto da peça: número (fotos locais antigas) ou URL do CDN da Nuvemshop (…-640-0.webp; existem 480 e 1024-1024) */
  function img(i, w) {
    if (typeof i === "string") return w && w > 640 ? i.replace(/-640-0\.webp$/, "-1024-1024.webp") : i.replace(/-640-0\.webp$/, "-480-0.webp");
    return "img/produtos/p" + i + "-" + (w || 400) + ".webp";
  }
  function imgSet(i) {
    if (typeof i === "string") return img(i) + " 480w, " + i + " 640w, " + img(i, 1024) + " 1024w";
    return img(i, 400) + " 400w, " + img(i, 800) + " 800w";
  }
  var CARD_SIZES = "(min-width: 1300px) 300px, (min-width: 900px) 24vw, 48vw";
  function byId(id) { return PRODUCTS.filter(function (p) { return p.id === id; })[0]; }
  function waLink(text) { return "https://wa.me/" + CFG.whatsapp + "?text=" + encodeURIComponent(text); }
  function brl(n) {
    return "R$ " + Number(n).toFixed(2).replace(".", ",").replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }
  function displayName(p) { return p.brand + " – " + p.name; }
  function sizesFor(p) {
    if (p.sizes && p.sizes.length) return p.sizes;
    return p.cat === "bones" ? STORE.SIZE_PLACEHOLDER_BONE : STORE.SIZE_PLACEHOLDER;
  }
  function priceInfo(p) {
    var x = PRICES[p.id];
    if (x && !x.placeholder && x.preco > 0) {
      var off = x.precoAntigo > x.preco ? Math.round((1 - x.preco / x.precoAntigo) * 100) : 0;
      var n = x.parcelas > 1 ? x.parcelas : MAX_PARC;
      var inst = n + "x de " + brl(x.preco / n) + " sem juros";
      return {
        placeholder: false,
        current: brl(x.preco),
        old: off ? brl(x.precoAntigo) : "",
        off: off,
        inst: inst,
        value: x.preco
      };
    }
    return {
      placeholder: true,
      current: PLACEHOLDER.label,
      old: "",
      off: 0,
      inst: "em até " + MAX_PARC + "x no cartão",
      value: null
    };
  }
  function productMessage(p, size) {
    var msg = "Olá! Vim pelo site da LS Conceito e quero comprar: " + displayName(p);
    if (size) msg += ", tamanho " + size;
    msg += ".";
    return msg;
  }

  /* ---------- Rastreamento (GA4 / Meta Pixel / GTM) ---------- */
  window.dataLayer = window.dataLayer || [];
  function loadScript(src) {
    var s = document.createElement("script");
    s.async = true;
    s.src = src;
    document.head.appendChild(s);
  }
  if (CFG.ga4) {
    loadScript("https://www.googletagmanager.com/gtag/js?id=" + CFG.ga4);
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag("js", new Date());
    window.gtag("config", CFG.ga4);
  }
  if (CFG.gtm) {
    window.dataLayer.push({ "gtm.start": Date.now(), event: "gtm.js" });
    loadScript("https://www.googletagmanager.com/gtm.js?id=" + CFG.gtm);
  }
  if (CFG.metaPixel) {
    !function (f, b, e, v, n, t, s) {
      if (f.fbq) return;
      n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); };
      if (!f._fbq) f._fbq = n;
      n.push = n; n.loaded = !0; n.version = "2.0"; n.queue = [];
      t = b.createElement(e); t.async = !0; t.src = v;
      s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s);
    }(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");
    window.fbq("init", CFG.metaPixel);
    window.fbq("track", "PageView");
  }
  var FB_MAP = { view_item: "ViewContent", add_to_cart: "AddToCart", click_comprar: "InitiateCheckout" };
  function track(name, p) {
    p = p || {};
    if (window.gtag) gtag("event", name, p);
    if (CFG.gtm) window.dataLayer.push(Object.assign({ event: name }, p));
    if (window.fbq && FB_MAP[name]) fbq("track", FB_MAP[name], { content_name: p.item_name });
  }

  $$(".js-whats").forEach(function (a) {
    a.href = waLink("Olá! Vim pelo site da LS Conceito e gostaria de ajuda.");
    a.target = "_blank";
    a.rel = "noopener";
  });
  var year = $("#year");
  if (year) year.textContent = new Date().getFullYear();

  var toastT;
  function toast(msg) {
    var t = $("#toast");
    if (!t) return;
    t.textContent = msg;
    t.classList.add("is-on");
    clearTimeout(toastT);
    toastT = setTimeout(function () { t.classList.remove("is-on"); }, 3200);
  }

  /* ---------- Entrada no scroll (nunca deixa conteúdo preso invisível) ---------- */
  var io = null;
  if ("IntersectionObserver" in window && !REDUCE) {
    io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        en.target.classList.add("rv-in");
        io.unobserve(en.target);
      });
    }, { rootMargin: "0px 0px -6% 0px", threshold: 0.05 });
  } else {
    document.documentElement.classList.add("no-rv");
  }
  function observe(el) {
    if (io) io.observe(el);
    else el.classList.add("rv-in");
  }
  /* faixas com rolagem lateral (categorias e marcas no celular): quando a faixa aparece,
     todos os itens entram juntos, inclusive os que estão fora da tela para o lado */
  var rowIo = io && new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (!en.isIntersecting) return;
      $$(".rv", en.target).forEach(function (el) { el.classList.add("rv-in"); io.unobserve(el); });
      rowIo.unobserve(en.target);
    });
  }, { threshold: 0.05 });
  function observeRow(row) { if (rowIo && row) rowIo.observe(row); }
  /* título da coleção vem do config.js (precisa existir antes de quebrar em palavras) */
  var colT = $("#colecaoTitulo");
  if (colT) colT.textContent = "Confira nossa coleção de " + ((CFG.colecao && CFG.colecao.titulo) || "Polo");

  /* títulos de seção: cada palavra sobe sozinha (texto continua inteiro para leitor de tela) */
  if (!REDUCE) {
    $$(".sec-head h2").forEach(function (h) {
      var words = h.textContent.trim().split(/\s+/);
      h.setAttribute("aria-label", h.textContent.trim());
      h.classList.add("split");
      h.innerHTML = words.map(function (w, i) {
        return '<span class="w" aria-hidden="true"><span style="--wi:' + i + '">' + esc(w) + "</span></span>";
      }).join(" ");
    });
  }
  $$(".rv").forEach(observe);

  /* ---------- Barra de anúncio: uma mensagem por vez ---------- */
  var avisos = CFG.avisos && CFG.avisos.length ? CFG.avisos : ["Enviamos para todo o Brasil"];
  var topMsgs = $("#topbarMsgs");
  topMsgs.innerHTML = avisos.map(function (a, i) {
    return '<p class="topbar-msg' + (i ? "" : " is-on") + '"' + (i ? ' aria-hidden="true"' : "") + ">" + esc(a) + "</p>";
  }).join("");
  if (avisos.length > 1 && !REDUCE) {
    var topIdx = 0;
    var topTimer = setInterval(function () {
      var msgs = $$(".topbar-msg", topMsgs);
      topIdx = (topIdx + 1) % msgs.length;
      msgs.forEach(function (m, i) {
        m.classList.toggle("is-on", i === topIdx);
        m.setAttribute("aria-hidden", i === topIdx ? "false" : "true");
      });
    }, 4500);
    $("#topbar").addEventListener("mouseenter", function () { clearInterval(topTimer); });
  }

  /* ---------- Marcas com logo (cada uma filtra o catálogo) ---------- */
  $("#brandGrid").innerHTML = (STORE.BRAND_LOGOS || []).map(function (b, i) {
    return '<button type="button" class="brand-card rv" style="--d:' + (i % 8) * 45 + 'ms" role="listitem" data-brand-pick="' + esc(b.name) + '" aria-label="Ver peças ' + esc(b.name) + '">' +
      '<img src="img/marcas/' + esc(b.slug) + '.webp" width="120" height="120" alt="" loading="lazy"><span>' + esc(b.name) + "</span></button>";
  }).join("");
  $$("#brandGrid .rv").forEach(observe);
  observeRow($("#brandGrid"));
  observeRow($(".cats-row"));
  var brandsUsed = STORE.BRANDS.filter(function (b) {
    return PRODUCTS.some(function (p) { return p.brand === b; });
  });

  /* ---------- Hero: slider de promoções ---------- */
  var slidesBox = $("#slides");
  var dotsBox = $("#heroDots");
  var banners = CFG.banners && CFG.banners.length ? CFG.banners : [];
  var heroIdx = 0;
  var heroTimer = null;
  var HERO_MS = 6500;
  slidesBox.innerHTML = banners.map(function (b, i) {
    var base = "img/banners/" + b.img + "-";
    return '<a class="slide' + (i ? "" : " is-active") + '" href="' + esc(b.href || "#catalogo") + '"' + (b.filter ? ' data-filter="' + esc(b.filter) + '"' : "") +
      (b.externo ? ' target="_blank" rel="noopener"' : "") + (b.grupo ? " data-grupo" : "") +
      ' role="group" aria-roledescription="slide" aria-label="' + (i + 1) + " de " + banners.length + '"' + (i ? ' tabindex="-1"' : "") + ">" +
      '<img src="' + base + '1100.webp" srcset="' + base + "720.webp 720w, " + base + "1100.webp 1100w, " + base + '1774.webp 1774w" sizes="(min-width: 1280px) 1280px, 100vw" width="1774" height="887" alt="' + esc(b.alt || "") + '"' +
      (i ? ' loading="lazy"' : ' fetchpriority="high"') + "></a>";
  }).join("");
  dotsBox.style.setProperty("--dur", HERO_MS + "ms");
  dotsBox.innerHTML = banners.map(function (b, i) {
    return '<button type="button" class="dot' + (i ? "" : " is-active") + '" role="tab" aria-label="Destaque ' + (i + 1) + '" data-slide="' + i + '"></button>';
  }).join("");
  if (banners.length < 2 || REDUCE) dotsBox.classList.add("is-static");
  if (banners.length < 2) dotsBox.hidden = true;

  function goSlide(n) {
    var slides = $$(".slide", slidesBox);
    var dots = $$(".dot", dotsBox);
    heroIdx = (n + slides.length) % slides.length;
    slides.forEach(function (s, i) {
      s.classList.toggle("is-active", i === heroIdx);
      s.tabIndex = i === heroIdx ? 0 : -1;
    });
    dots.forEach(function (d, i) {
      d.classList.remove("is-active");
      if (i === heroIdx) { void d.offsetWidth; d.classList.add("is-active"); }
      d.setAttribute("aria-selected", i === heroIdx ? "true" : "false");
    });
    armHero();
  }
  function armHero() {
    clearTimeout(heroTimer);
    if (banners.length < 2 || REDUCE || heroPaused) return;
    heroTimer = setTimeout(function () { goSlide(heroIdx + 1); }, HERO_MS);
  }
  var heroPaused = false;
  var hero = $("#hero");
  function pauseHero(on) {
    heroPaused = on;
    dotsBox.classList.toggle("is-paused", on);
    if (on) clearTimeout(heroTimer);
    else goSlide(heroIdx);
  }
  hero.addEventListener("mouseenter", function () { pauseHero(true); });
  hero.addEventListener("mouseleave", function () { pauseHero(false); });
  document.addEventListener("visibilitychange", function () { pauseHero(document.hidden); });
  dotsBox.addEventListener("click", function (e) {
    var d = e.target.closest("[data-slide]");
    if (d) goSlide(+d.dataset.slide);
  });
  armHero();

  /* setas (desktop) e arrastar com o dedo (celular) no hero */
  if (banners.length > 1) {
    hero.insertAdjacentHTML("beforeend",
      '<button type="button" class="hero-arrow prev" aria-label="Destaque anterior"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg></button>' +
      '<button type="button" class="hero-arrow next" aria-label="Próximo destaque"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg></button>');
    $(".hero-arrow.prev", hero).addEventListener("click", function () { goSlide(heroIdx - 1); });
    $(".hero-arrow.next", hero).addEventListener("click", function () { goSlide(heroIdx + 1); });
    var touchX = null;
    hero.addEventListener("touchstart", function (e) { touchX = e.touches[0].clientX; }, { passive: true });
    hero.addEventListener("touchend", function (e) {
      if (touchX == null) return;
      var dx = e.changedTouches[0].clientX - touchX;
      touchX = null;
      if (Math.abs(dx) > 40) goSlide(heroIdx + (dx < 0 ? 1 : -1));
    }, { passive: true });
  }

  /* botão de voltar ao topo */
  document.body.insertAdjacentHTML("beforeend",
    '<button type="button" class="to-top" id="toTop" aria-label="Voltar ao topo">' +
    '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 14l6-6 6 6"/></svg></button>');
  var toTop = $("#toTop");
  toTop.addEventListener("click", function () { window.scrollTo({ top: 0, behavior: REDUCE ? "auto" : "smooth" }); });

  /* header encolhe ao rolar e barra dourada de progresso */
  var header = $("#header");
  var progress = null;
  if (!REDUCE) {
    progress = document.createElement("div");
    progress.className = "scroll-progress";
    progress.setAttribute("aria-hidden", "true");
    document.body.appendChild(progress);
  }
  var ticking = false;
  function onScroll() {
    var y = window.scrollY;
    header.classList.toggle("is-scrolled", y > 40);
    toTop.classList.toggle("is-on", y > window.innerHeight * 1.2);
    if (progress) {
      var max = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.transform = "scaleX(" + (max > 0 ? Math.min(1, y / max) : 0) + ")";
    }
    ticking = false;
  }
  window.addEventListener("scroll", function () {
    if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
  }, { passive: true });
  onScroll();

  /* ---------- Cards e catálogo ---------- */
  function cardHtml(p, eager, idx) {
    var price = priceInfo(p);
    var sizes = sizesFor(p);
    var name = displayName(p);
    var priceHtml = '<p class="price' + (price.placeholder ? " is-placeholder" : "") + '" data-placeholder="' + (price.placeholder ? "true" : "false") + '">';
    if (price.old) priceHtml += "<s>" + esc(price.old) + "</s>";
    priceHtml += "<b>" + esc(price.current) + "</b>";
    if (price.off) priceHtml += '<em class="off">' + price.off + "% OFF</em>";
    priceHtml += "</p>";
    var lazy = eager ? "" : ' loading="lazy"';
    var second = p.imgs[1] != null ? '<img class="im-b" src="' + img(p.imgs[1]) + '" srcset="' + imgSet(p.imgs[1]) + '" sizes="' + CARD_SIZES + '" alt="" loading="lazy">' : "";
    return '<article class="card rv" style="--d:' + ((idx % 4) * 60) + 'ms" data-id="' + esc(p.id) + '" data-cat="' + esc(p.cat) + '" data-brand="' + esc(p.brand) + '" data-sizes="' + esc(sizes.join(",")) + '" data-sizes-placeholder="' + (p.sizesPlaceholder ? "true" : "false") + '" data-price="' + (price.value == null ? "" : price.value) + '"><div class="card-in">' +
      '<button type="button" class="card-media" data-open="' + esc(p.id) + '" aria-label="Ver fotos de ' + esc(name) + '">' +
      (p.tag ? '<span class="card-tag">' + esc(p.tag) + "</span>" : "") +
      '<img class="im-a" src="' + img(p.imgs[0]) + '" srcset="' + imgSet(p.imgs[0]) + '" sizes="' + CARD_SIZES + '" alt="' + esc(name) + '"' + lazy + ">" + second + "</button>" +
      '<div class="card-body"><p class="card-brand">' + esc(p.brand) + '</p><p class="card-name">' + esc(p.name) + "</p>" +
      priceHtml +
      '<p class="installments">' + instHtml(price.inst) + "</p>" +
      '<div class="card-actions">' +
      '<select class="card-size" aria-label="Tamanho de ' + esc(name) + '"><option value="">Tam.</option>' +
      sizes.map(function (s) { return '<option value="' + esc(s) + '">' + esc(s) + "</option>"; }).join("") +
      "</select>" +
      (p.stock === false
        ? '<button type="button" class="btn btn-line card-btn" disabled>Esgotado</button>'
        : '<button type="button" class="btn btn-gold card-btn" data-add="' + esc(p.id) + '">Comprar</button>') +
      "</div>" +
      "</div></div></article>";
  }
  /* "12x de R$ 15,82 sem juros" com o número de parcelas em destaque */
  function instHtml(text) {
    return esc(text).replace(/(\d+x)/, "<b>$1</b>");
  }

  var launch = $("#launchGrid");
  (CFG.lancamentos || []).slice(0, 4).map(byId).filter(Boolean).forEach(function (p, i) {
    launch.insertAdjacentHTML("beforeend", cardHtml(p, i < 4, i));
  });
  $$(".card", launch).forEach(observe);

  /* ---------- Compre por categoria: círculos com ícone ---------- */
  var ICON = {
    camisetas: '<path d="M9 3 4 6l2 4 2-1v12h8V9l2 1 2-4-5-3c-.5 1.5-1.7 2.5-3 2.5S9.5 4.5 9 3z"/>',
    polos: '<path d="M9 3 4 6l2 4 2-1v12h8V9l2 1 2-4-5-3"/><path d="M9 3l3 4 3-4M12 7v4"/>',
    calcas: '<path d="M7 3h10l1 18h-4l-2-11-2 11H6z"/><path d="M7 6h10"/>',
    bermudas: '<path d="M6 5h12l1 11h-5l-2-6-2 6H5z"/><path d="M6 8h12"/>',
    moletons: '<path d="M8 4c0 2 1.8 3 4 3s4-1 4-3l4 3-1 5-2-1v10H7V11l-2 1-1-5z"/><path d="M10 15h4"/>',
    conjuntos: '<path d="M8 2 4 4l1.5 3L7 6v6h10V6l1.5 1L20 4l-4-2c-.4 1.2-2 2-4 2s-3.6-.8-4-2z"/><path d="M8 14h8l1 8h-3.5l-1.5-5-1.5 5H7z"/>',
    tenis: '<path d="M3 16v-4l5-1 3-4 3 3 4 1c2 .5 3 1.6 3 3v2z"/><path d="M3 18h18"/>',
    bones: '<path d="M4 15a8 8 0 0 1 16 0z"/><path d="M12 7v2M2 15h20"/>'
  };
  var CIRCLES = ["camisetas", "polos", "calcas", "bermudas", "moletons", "conjuntos", "tenis", "bones"];
  $("#catCircles").innerHTML = CIRCLES.map(function (c, i) {
    var n = PRODUCTS.filter(function (p) { return p.cat === c; }).length;
    return '<a href="#catalogo" class="cat-circle rv" style="--d:' + i * 50 + 'ms" data-filter="' + c + '"' + (n ? "" : ' data-soon="1"') + ">" +
      '<span class="cat-ico"><svg viewBox="0 0 24 24" aria-hidden="true">' + ICON[c] + "</svg></span>" +
      '<span class="cat-name">' + esc(STORE.CATS_PLURAL[c]) + "</span>" +
      (n ? "" : '<span class="cat-soon">em breve</span>') + "</a>";
  }).join("");
  $$("#catCircles .rv").forEach(observe);
  observeRow($("#catCircles"));

  /* ---------- Coleção em destaque (faixa com rolagem lateral) ---------- */
  var COL = CFG.colecao || { cat: "polos", titulo: "Polo" };
  $("#colecaoLink").dataset.filter = COL.cat;
  var rail = $("#colecaoRail");
  rail.innerHTML = PRODUCTS.filter(function (p) { return p.cat === COL.cat; }).slice(0, 10).map(function (p, i) {
    return cardHtml(p, false, i);
  }).join("");
  $$(".card", rail).forEach(function (c) { c.classList.add("rv-in"); c.classList.remove("rv"); });
  $$("[data-rail]").forEach(function (b) {
    b.addEventListener("click", function () {
      rail.scrollBy({ left: +b.dataset.rail * rail.clientWidth * 0.9, behavior: REDUCE ? "auto" : "smooth" });
    });
  });

  var brandSelect = $("#brandSelect");
  brandSelect.insertAdjacentHTML("beforeend", brandsUsed.map(function (b) {
    return '<option value="' + esc(b) + '">' + esc(b) + "</option>";
  }).join(""));

  var state = { cat: "todos", brand: "todas", size: "todos", sort: "default", q: "" };
  var grid = $("#grid");

  /* busca sem acento e por palavras: "camiseta nike" acha "Nike – Camiseta Preta…" */
  function norm(t) { return String(t).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""); }
  function haystack(p) {
    return norm([p.brand, p.name, STORE.CATS[p.cat], STORE.CATS_PLURAL[p.cat]].join(" "));
  }
  function match(p) {
    if (state.q) {
      var h = haystack(p);
      var words = norm(state.q).split(/\s+/).filter(Boolean);
      // "camiseta polo" / "camisa polo" = polo: a palavra polo já basta
      if (words.some(function (w) { return /^polos?$/.test(w); })) {
        words = words.filter(function (w) { return !/^camis(a|eta)s?$/.test(w); });
      }
      for (var i = 0; i < words.length; i++) {
        var w = words[i].replace(/s$/, "");
        if (h.indexOf(w) === -1) return false;
      }
    }
    if (state.cat !== "todos" && p.cat !== state.cat) return false;
    if (state.brand !== "todas" && p.brand !== state.brand) return false;
    if (state.size !== "todos" && sizesFor(p).indexOf(state.size) === -1) return false;
    return true;
  }
  function compare(a, b) {
    if (state.sort !== "price-asc" && state.sort !== "price-desc") return 0;
    var dir = state.sort === "price-asc" ? 1 : -1;
    var pa = priceInfo(a).value;
    var pb = priceInfo(b).value;
    if (pa == null && pb == null) return 0;
    if (pa == null) return 1;
    if (pb == null) return -1;
    return (pa - pb) * dir;
  }
  function syncControls() {
    $$("#filters .chip").forEach(function (c) { c.classList.toggle("is-active", c.dataset.filter === state.cat); });
    brandSelect.value = state.brand;
    $("#sizeSelect").value = state.size;
    $("#sort").value = state.sort;
    brandSelect.classList.toggle("is-set", state.brand !== "todas");
    $("#sizeSelect").classList.toggle("is-set", state.size !== "todos");
    if ($("#search").value !== state.q) $("#search").value = state.q;
    $$("[data-brand-pick]").forEach(function (c) { c.classList.toggle("is-active", c.dataset.brandPick === state.brand); });
    $$(".cat-circle[data-filter]").forEach(function (c) { c.classList.toggle("is-active", c.dataset.filter === state.cat && state.cat !== "todos"); });
    $("#clearFilters").hidden = !filtering();
  }
  function filtering() {
    return state.cat !== "todos" || state.brand !== "todas" || state.size !== "todos" || state.sort !== "default" || !!state.q;
  }
  function drawCatalog() {
    var list = PRODUCTS.filter(match).sort(compare);
    grid.innerHTML = list.map(function (p, i) { return cardHtml(p, false, i); }).join("");
    $$(".card", grid).forEach(observe);
    var empty = $("#emptyMsg");
    if (empty) empty.hidden = list.length > 0;
    var count = $("#resultCount");
    if (count) {
      var txt = list.length + (list.length === 1 ? " peça" : " peças");
      if (count.textContent && count.textContent !== txt && !REDUCE) {
        count.classList.add("tick");
        setTimeout(function () { count.classList.remove("tick"); }, 320);
      }
      count.textContent = txt;
    }
    syncControls();
  }
  var swapT;
  function renderCatalog(animate) {
    clearTimeout(swapT);
    var old = $$(".card", grid);
    if (!animate || REDUCE || !old.length) { drawCatalog(); return; }
    old.forEach(function (c) { c.classList.add("rv-leave"); });
    syncControls();
    swapT = setTimeout(drawCatalog, 190);
  }
  function setState(partial) {
    Object.keys(partial).forEach(function (k) { state[k] = partial[k]; });
    renderCatalog(true);
  }
  /* vindo das páginas institucionais: index.html?cat=polos#catalogo */
  var catParam = new URLSearchParams(location.search).get("cat");
  if (catParam && STORE.CATS_PLURAL[catParam]) state.cat = catParam;
  renderCatalog(false);

  var CLEAR = { cat: "todos", brand: "todas", size: "todos", sort: "default", q: "" };
  $("#sort").addEventListener("change", function () { setState({ sort: this.value }); });
  brandSelect.addEventListener("change", function () { setState({ brand: this.value }); });
  $("#sizeSelect").addEventListener("change", function () { setState({ size: this.value }); });
  var searchT;
  $("#search").addEventListener("input", function () {
    var v = this.value.trim();
    clearTimeout(searchT);
    searchT = setTimeout(function () { setState({ q: v }); }, 180);
  });
  $("#clearFilters").addEventListener("click", function () { setState(CLEAR); });
  $("#searchBtn").addEventListener("click", function () {
    scrollToEl($("#catalogo"));
    setTimeout(function () { $("#search").focus({ preventScroll: true }); }, REDUCE ? 0 : 450);
  });

  function scrollToEl(el) {
    if (!el) return;
    el.scrollIntoView({ behavior: REDUCE ? "auto" : "smooth", block: "start" });
  }
  function closeNav() {
    $("#nav").classList.remove("is-open");
    var b = $("#burger");
    b.classList.remove("is-open");
    b.setAttribute("aria-expanded", "false");
  }
  function selectedSize(card) {
    var sel = $(".card-size", card);
    return sel ? sel.value : "";
  }
  function shakeSizes(box) {
    (box.matches && box.matches("select") ? [box] : $$(".size, .card-size", box)).forEach(function (s) {
      s.classList.remove("shake");
      void s.offsetWidth;
      s.classList.add("shake");
    });
    toast("Escolha o tamanho");
  }

  /* ---------- Carrinho (mock do fluxo da Nuvemshop; guarda só id, tamanho e quantidade) ---------- */
  var CART_KEY = "ls-conceito-cart-v1";
  var MAX_QTY = 10;
  var cart = loadCart();
  function loadCart() {
    try {
      var raw = JSON.parse(localStorage.getItem(CART_KEY) || "[]");
      return (Array.isArray(raw) ? raw : []).filter(function (it) {
        return it && byId(it.id) && typeof it.size === "string" && it.qty > 0;
      }).map(function (it) { return { id: it.id, size: it.size, qty: Math.min(MAX_QTY, Math.floor(it.qty)) }; });
    } catch (e) { return []; }
  }
  function saveCart() {
    try { localStorage.setItem(CART_KEY, JSON.stringify(cart)); } catch (e) { /* sem armazenamento: o carrinho vale só nesta visita */ }
  }
  function cartCount() { return cart.reduce(function (n, it) { return n + it.qty; }, 0); }
  function findItem(id, size) {
    return cart.filter(function (it) { return it.id === id && it.size === size; })[0];
  }


  var drawer = $("#drawer");
  var drawerBg = $("#drawerBg");
  var cartBtn = $("#cartBtn");
  var countEl = $("#cartCount");
  var lastFocus = null;

  function renderCart(bump) {
    var n = cartCount();
    countEl.textContent = n;
    countEl.classList.toggle("has-items", n > 0);
    cartBtn.setAttribute("aria-label", "Abrir carrinho, " + n + (n === 1 ? " item" : " itens"));
    if (bump) {
      countEl.classList.remove("bump");
      void countEl.offsetWidth;
      countEl.classList.add("bump");
    }
    var body = $("#drawerBody");
    var foot = $("#drawerFoot");
    foot.hidden = !cart.length;
    if (!cart.length) {
      body.innerHTML = '<div class="cart-empty"><p>Seu carrinho está vazio.</p><button type="button" class="btn btn-ghost" data-cart-close>Continuar comprando</button></div>';
      return;
    }
    var total = 0;
    var allPriced = true;
    body.innerHTML = cart.map(function (it, i) {
      var p = byId(it.id);
      var price = priceInfo(p);
      if (price.value == null) allPriced = false;
      else total += price.value * it.qty;
      return '<div class="cart-item" style="animation-delay:' + (i * 50) + 'ms">' +
        '<div class="ci-img"><img src="' + img(p.imgs[0]) + '" alt="" loading="lazy"></div>' +
        '<div class="ci-info"><p class="ci-name">' + esc(displayName(p)) + "</p>" +
        '<p class="ci-meta">Tamanho ' + esc(it.size) + "</p>" +
        '<p class="ci-price' + (price.placeholder ? " is-placeholder" : "") + '">' + esc(price.value == null ? price.current : brl(price.value * it.qty)) + "</p>" +
        '<div class="ci-row"><div class="qty" role="group" aria-label="Quantidade">' +
        '<button type="button" data-qty="-1" data-id="' + esc(it.id) + '" data-size="' + esc(it.size) + '" aria-label="Diminuir">−</button>' +
        "<span>" + it.qty + "</span>" +
        '<button type="button" data-qty="1" data-id="' + esc(it.id) + '" data-size="' + esc(it.size) + '" aria-label="Aumentar">+</button></div>' +
        '<button type="button" class="ci-remove" data-remove data-id="' + esc(it.id) + '" data-size="' + esc(it.size) + '">Remover</button></div>' +
        "</div></div>";
    }).join("");
    var sum = $("#cartSum");
    sum.textContent = allPriced ? brl(total) : "A confirmar";
    sum.classList.toggle("is-placeholder", !allPriced);
    $("#cartNote").textContent = allPriced ? "Frete e cupom são calculados no checkout." : "Há peças com preço a confirmar. O valor final aparece no checkout.";
  }

  function openDrawer() {
    lastFocus = document.activeElement;
    $("#toast").classList.remove("is-on");
    renderCart(false);
    drawer.classList.add("is-open");
    drawerBg.classList.add("is-open");
    drawer.setAttribute("aria-hidden", "false");
    document.documentElement.style.overflow = "hidden";
    setTimeout(function () { var x = $(".drawer-x", drawer); if (x) x.focus({ preventScroll: true }); }, 60);
  }
  function closeNotice() {
    $("#notice").classList.remove("is-open");
    $("#notice").setAttribute("aria-hidden", "true");
  }
  function closeDrawer() {
    closeNotice();
    drawer.classList.remove("is-open");
    drawerBg.classList.remove("is-open");
    drawer.setAttribute("aria-hidden", "true");
    document.documentElement.style.overflow = $("#modal").classList.contains("is-open") ? "hidden" : "";
    if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
  }
  function addToCart(id, size) {
    var it = findItem(id, size);
    if (it) it.qty = Math.min(MAX_QTY, it.qty + 1);
    else cart.push({ id: id, size: size, qty: 1 });
    saveCart();
    renderCart(true);
    track("add_to_cart", { item_id: id, item_name: byId(id).name, size: size });
  }
  function flashAdded(btn) {
    var c = btn.closest(".card");
    if (c && !REDUCE) {
      c.classList.remove("added");
      void c.offsetWidth;
      c.classList.add("added");
    }
    var label = btn.textContent;
    btn.classList.add("is-done");
    btn.textContent = "Adicionado ✓";
    setTimeout(function () { btn.classList.remove("is-done"); btn.textContent = label; }, 1100);
  }
  function changeQty(id, size, delta) {
    var it = findItem(id, size);
    if (!it) return;
    it.qty += delta;
    if (it.qty < 1) cart.splice(cart.indexOf(it), 1);
    it.qty = Math.min(MAX_QTY, it.qty);
    saveCart();
    renderCart(true);
  }
  function removeItem(id, size) {
    var it = findItem(id, size);
    if (it) cart.splice(cart.indexOf(it), 1);
    saveCart();
    renderCart(true);
  }

  /* ---------- Cliques ---------- */
  document.addEventListener("click", function (e) {
    if (e.target.closest("[data-clear]")) { setState(CLEAR); return; }

    var grupo = e.target.closest("[data-grupo]");
    if (grupo && !CFG.grupoNovidades) {
      e.preventDefault();
      toast("O link do grupo de novidades chega em breve. Enquanto isso, chame a loja no WhatsApp.");
      return;
    }

    var add = e.target.closest("[data-add]");
    if (add) {
      var card = add.closest(".card");
      var size = selectedSize(card);
      if (!size) { shakeSizes(card); return; }
      addToCart(add.dataset.add, size);
      flashAdded(add);
      setTimeout(openDrawer, 350);
      return;
    }

    if (e.target.closest("[data-cart-open]")) { openDrawer(); return; }
    if (e.target.closest("[data-cart-close]")) { closeDrawer(); return; }
    var q = e.target.closest("[data-qty]");
    if (q) { changeQty(q.dataset.id, q.dataset.size, +q.dataset.qty); return; }
    var rm = e.target.closest("[data-remove]");
    if (rm) { removeItem(rm.dataset.id, rm.dataset.size); return; }

    var open = e.target.closest("[data-open]");
    if (open) { openProduct(open.dataset.open); return; }

    var chip = e.target.closest(".chip");
    if (chip && chip.closest("#filters")) { setState({ cat: chip.dataset.filter }); return; }

    var brandPick = e.target.closest("[data-brand-pick]");
    if (brandPick) {
      setState({ brand: brandPick.dataset.brandPick, cat: "todos", size: "todos", q: "" });
      scrollToEl($("#catalogo"));
      closeNav();
      return;
    }

    var soon = e.target.closest("[data-soon]");
    if (soon) {
      e.preventDefault();
      toast(STORE.CATS_PLURAL[soon.dataset.filter] + ": peças chegando em breve na loja online.");
      return;
    }

    var a = e.target.closest('a[href^="#"]');
    if (!a || a.getAttribute("href") === "#") return;
    if (a.dataset.filter) setState({ cat: a.dataset.filter, brand: "todas", size: "todos", q: "" });
    var target = $(a.getAttribute("href"));
    if (!target) return;
    e.preventDefault();
    scrollToEl(target);
    closeNav();
  });

  $("#checkoutBtn").addEventListener("click", function () {
    var n = $("#notice");
    n.classList.add("is-open");
    n.setAttribute("aria-hidden", "false");
    $("#noticeOk").focus({ preventScroll: true });
    track("click_comprar", { item_name: "carrinho", items: cartCount() });
  });
  $("#noticeOk").addEventListener("click", closeNotice);
  /* carrinho → loja real: lista os links das peças escolhidas */
  if (CFG.loja) {
    var noticeBox = $("#notice");
    noticeBox.insertAdjacentHTML("beforeend", '<div class="notice-links" id="noticeLinks"></div>');
    $("#checkoutBtn").addEventListener("click", function () {
      $("#noticeLinks").innerHTML = cart.map(function (it) {
        var p = byId(it.id);
        return '<a href="' + esc(p.url || CFG.loja) + '" target="_blank" rel="noopener">' + esc(displayName(p)) + " · " + esc(it.size) + " ↗</a>";
      }).join("") + '<a class="btn btn-line btn-block" href="' + esc(CFG.loja) + '" target="_blank" rel="noopener">Abrir a loja online</a>';
    });
  }

  $("#burger").addEventListener("click", function () {
    var open = !$("#nav").classList.contains("is-open");
    $("#nav").classList.toggle("is-open", open);
    this.classList.toggle("is-open", open);
    this.setAttribute("aria-expanded", open ? "true" : "false");
  });

  /* ---------- Modal ---------- */
  var modal = $("#modal");
  var cur = null;
  var curSize = null;
  function openProduct(id) {
    cur = byId(id);
    if (!cur) return;
    curSize = null;
    var price = priceInfo(cur);
    $("#mImg").src = img(cur.imgs[0], 800);
    $("#mImg").alt = displayName(cur);
    $("#mName").textContent = displayName(cur);
    $("#mCat").textContent = STORE.CATS[cur.cat];
    $("#mPrice").className = "price" + (price.placeholder ? " is-placeholder" : "");
    $("#mPrice").innerHTML = (price.old ? "<s>" + esc(price.old) + "</s>" : "") + "<b>" + esc(price.current) + "</b>" + (price.off ? '<em class="off">' + price.off + "% OFF</em>" : "");
    $("#mInst").innerHTML = instHtml(price.inst);
    $("#mThumbs").innerHTML = cur.imgs.length > 1 ? cur.imgs.map(function (n, i) {
      return '<button type="button" class="' + (i ? "" : "is-active") + '" data-src="' + img(n, 800) + '" aria-label="Foto ' + (i + 1) + '"><img src="' + img(n) + '" alt=""></button>';
    }).join("") : "";
    $("#mSizes").innerHTML = '<option value="">Tamanhos</option>' + sizesFor(cur).map(function (s) {
      return '<option value="' + esc(s) + '">' + esc(s) + "</option>";
    }).join("");
    $("#mSizes").classList.remove("is-set");
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.documentElement.style.overflow = "hidden";
    track("view_item", { item_id: cur.id, item_name: cur.name });
  }
  function closeProduct() {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.documentElement.style.overflow = drawer.classList.contains("is-open") ? "hidden" : "";
  }
  $("#mThumbs").addEventListener("click", function (e) {
    var b = e.target.closest("button");
    if (!b) return;
    $$("button", this).forEach(function (x) { x.classList.toggle("is-active", x === b); });
    var mi = $("#mImg");
    if (REDUCE) { mi.src = b.dataset.src; return; }
    mi.classList.add("swap");
    setTimeout(function () { mi.src = b.dataset.src; mi.classList.remove("swap"); }, 180);
  });
  $("#mSizes").addEventListener("change", function () {
    curSize = this.value || null;
    this.classList.toggle("is-set", !!curSize);
  });
  $("#mAdd").addEventListener("click", function () {
    if (!cur) return;
    if (!curSize) { shakeSizes($("#mSizes")); return; }
    addToCart(cur.id, curSize);
    flashAdded(this);
    setTimeout(function () { closeProduct(); openDrawer(); }, 350);
  });
  $$("[data-close]", modal).forEach(function (b) {
    b.addEventListener("click", closeProduct);
  });
  document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape") return;
    if ($("#notice").classList.contains("is-open")) closeNotice();
    else if (drawer.classList.contains("is-open")) closeDrawer();
    else if (modal.classList.contains("is-open")) closeProduct();
  });

  var news = $("#newsForm");
  if (news) news.addEventListener("submit", function (e) {
    e.preventDefault();
    toast("Newsletter em breve. Por enquanto, siga a gente no Instagram.");
  });

  /* ---------- Grupo de novidades (link pendente até a loja enviar) ---------- */
  if (CFG.grupoNovidades) {
    $$("[data-grupo]").forEach(function (a) {
      a.href = CFG.grupoNovidades;
      a.target = "_blank";
      a.rel = "noopener";
    });
  }

  /* ---------- Mockup do grupo de novidades ---------- */
  $("#grupoScreen").innerHTML = CFG.grupoImagem
    ? '<img src="' + esc(CFG.grupoImagem) + '" alt="Grupo de novidades da LS Conceito no WhatsApp" loading="lazy">'
    : '<span class="wa-head"><img src="img/logo-mark.webp" alt=""><span><b>Novidades LS Conceito</b><small>grupo · WhatsApp</small></span></span>' +
      '<span class="wa-body"><span class="wa-msg">Print real do grupo</span><span class="wa-msg wa-msg--me">pendente: aguardando a loja</span>' +
      '<img class="wa-pic" src="img/produtos/p2-400.webp" alt=""><span class="wa-msg">Novidades e reposições aparecem aqui</span></span>' +
      '<span class="ph-tag ph-tag--phone">Espaço para o print do grupo</span>';

  /* ---------- Avaliações: só reais, vindas de config.js ---------- */
  var reviews = CFG.depoimentos || [];
  $("#reviews").innerHTML = reviews.length ? reviews.map(function (r) {
    return '<figure class="review rv"><div class="review-stars" aria-label="5 de 5 estrelas">★★★★★</div>' +
      "<blockquote><p>" + esc(r.texto) + "</p></blockquote>" +
      '<figcaption class="review-who">' + (r.foto ? '<img src="' + esc(r.foto) + '" alt="" loading="lazy">' : "") +
      "<span><b>" + esc(r.nome) + "</b>" + esc(r.cidade || "") + "</span></figcaption></figure>";
  }).join("") : [1, 2, 3].map(function (n) {
    /* PENDENTE (Lorenzo): espaço marcado; nenhum nome, cidade ou texto inventado */
    return '<figure class="review review--placeholder rv" style="--d:' + (n - 1) * 90 + 'ms"><span class="ph-tag">Exemplo · aguardando cliente real</span>' +
      '<span class="ph-avatar" aria-hidden="true"></span><div class="review-stars" aria-hidden="true">★★★★★</div>' +
      '<p class="ph-line">Nome | Cidade</p><p class="ph-text">Aqui entra a mensagem real de um cliente, com foto, nome e cidade enviados pela loja.</p></figure>';
  }).join("");
  $$("#reviews .rv").forEach(observe);

  /* ---------- Vídeo institucional fixo com botão de fechar (fase 2) ---------- */
  var vf = $("#videoFloat");
  if (CFG.videoInstitucional && vf && !sessionStorage.getItem("ls-video-closed")) {
    vf.innerHTML = '<video src="' + esc(CFG.videoInstitucional) + '" autoplay muted loop playsinline></video>' +
      '<button class="modal-x" type="button" aria-label="Fechar vídeo">✕</button>';
    vf.hidden = false;
    $(".modal-x", vf).addEventListener("click", function () {
      vf.remove();
      try { sessionStorage.setItem("ls-video-closed", "1"); } catch (e) { /* sem armazenamento */ }
    });
  }

  renderCart(false);
})();
