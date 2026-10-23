/* LS Conceito: vitrine. A compra da peça sai pelo WhatsApp, com o produto e o tamanho. */
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
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function img(i) { return "img/p" + i + ".jpg"; }
  function byId(id) { return PRODUCTS.filter(function (p) { return p.id === id; })[0]; }
  function waLink(text) { return "https://wa.me/" + CFG.whatsapp + "?text=" + encodeURIComponent(text); }
  function brl(n) {
    return "R$ " + Number(n).toFixed(2).replace(".", ",").replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }
  function displayName(p) { return p.brand + " \u2013 " + p.name; }
  function sizesFor(p) {
    if (p.sizes && p.sizes.length) return p.sizes;
    return p.cat === "bones" ? STORE.SIZE_PLACEHOLDER_BONE : STORE.SIZE_PLACEHOLDER;
  }
  function priceInfo(p) {
    var x = PRICES[p.id];
    if (x && !x.placeholder && x.preco > 0) {
      var off = x.precoAntigo > x.preco ? Math.round((1 - x.preco / x.precoAntigo) * 100) : 0;
      var inst = x.parcelas > 1 ? (x.parcelas + "x de " + brl(x.preco / x.parcelas)) : "em até 12x no cartão";
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
      inst: PLACEHOLDER.parcelasLabel,
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
  var FB_MAP = { view_item: "ViewContent", click_comprar: "InitiateCheckout" };
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

  (function () {
    var avisos = CFG.avisos && CFG.avisos.length ? CFG.avisos : ["Enviamos para todo o Brasil"];
    var el = $("#topbarMsg");
    if (!el) return;
    var i = 0;
    el.textContent = avisos[0];
    if (avisos.length < 2) return;
    setInterval(function () {
      i = (i + 1) % avisos.length;
      el.textContent = avisos[i];
    }, 3800);
  })();

  function cardHtml(p, eager) {
    var price = priceInfo(p);
    var sizes = sizesFor(p);
    var name = displayName(p);
    var priceHtml = '<p class="price' + (price.placeholder ? " is-placeholder" : "") + '" data-placeholder="' + (price.placeholder ? "true" : "false") + '">';
    if (price.old) priceHtml += "<s>" + esc(price.old) + "</s>";
    priceHtml += "<b>" + esc(price.current) + "</b>";
    if (price.off) priceHtml += '<em class="off">' + price.off + "% OFF</em>";
    priceHtml += "</p>";
    return '<article class="card" data-id="' + esc(p.id) + '" data-cat="' + esc(p.cat) + '" data-brand="' + esc(p.brand) + '" data-sizes="' + esc(sizes.join(",")) + '" data-sizes-placeholder="' + (p.sizesPlaceholder ? "true" : "false") + '" data-price="' + (price.value == null ? "" : price.value) + '">' +
      '<button type="button" class="card-media" data-open="' + esc(p.id) + '" aria-label="Ver fotos de ' + esc(name) + '">' +
      (p.tag ? '<span class="card-tag">' + esc(p.tag) + "</span>" : "") +
      '<img src="' + img(p.imgs[0]) + '" alt="' + esc(name) + '" ' + (eager ? "" : 'loading="lazy" ') + "></button>" +
      '<div class="card-body"><p class="card-name">' + esc(name) + "</p>" +
      priceHtml +
      '<p class="installments">' + esc(price.inst) + "</p>" +
      '<div class="sizes" role="group" aria-label="Tamanho de ' + esc(name) + '">' +
      sizes.map(function (s) {
        return '<button type="button" class="size" data-size="' + esc(s) + '">' + esc(s) + "</button>";
      }).join("") +
      "</div>" +
      '<a class="btn btn-gold card-btn" target="_blank" rel="noopener" data-wa-buy="' + esc(p.id) + '" href="' + waLink(productMessage(p, "")) + '">Comprar pelo WhatsApp</a>' +
      "</div></article>";
  }

  var launch = $("#launchGrid");
  (CFG.lancamentos || []).map(byId).filter(Boolean).forEach(function (p, i) {
    launch.insertAdjacentHTML("beforeend", cardHtml(p, i < 4));
  });

  var brandsUsed = STORE.BRANDS.filter(function (b) {
    return PRODUCTS.some(function (p) { return p.brand === b; });
  });
  var brandBox = $("#brandFilters");
  brandBox.innerHTML = '<button class="chip is-active" type="button" data-brand="todas">Todas</button>' +
    brandsUsed.map(function (b) {
      return '<button class="chip" type="button" data-brand="' + esc(b) + '">' + esc(b) + "</button>";
    }).join("");
  $("#brandsRow").innerHTML = brandsUsed.map(function (b) {
    return '<button type="button" class="brand-tile" data-brand-pick="' + esc(b) + '">' + esc(b) + "</button>";
  }).join("");

  var state = { cat: "todos", brand: "todas", size: "todos", sort: "default" };
  var grid = $("#grid");

  function match(p) {
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
    $$("#brandFilters .chip").forEach(function (c) { c.classList.toggle("is-active", c.dataset.brand === state.brand); });
    $$("#sizeFilters .chip").forEach(function (c) { c.classList.toggle("is-active", c.dataset.size === state.size); });
    $$("[data-brand-pick]").forEach(function (c) { c.classList.toggle("is-active", c.dataset.brandPick === state.brand); });
    $$("a[data-filter]").forEach(function (c) { c.classList.toggle("is-active", c.dataset.filter === state.cat && state.cat !== "todos"); });
  }
  function renderCatalog() {
    var list = PRODUCTS.filter(match).sort(compare);
    grid.innerHTML = list.map(function (p) { return cardHtml(p, false); }).join("");
    var empty = $("#emptyMsg");
    if (empty) empty.hidden = list.length > 0;
    var count = $("#resultCount");
    if (count) count.textContent = list.length + (list.length === 1 ? " peça" : " peças");
    syncControls();
  }
  function setState(partial) {
    Object.keys(partial).forEach(function (k) { state[k] = partial[k]; });
    renderCatalog();
  }
  renderCatalog();

  var sort = $("#sort");
  if (sort) sort.addEventListener("change", function () { setState({ sort: sort.value }); });

  function scrollToEl(el) {
    if (!el) return;
    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  }
  function closeNav() {
    $("#nav").classList.remove("is-open");
    var b = $("#burger");
    b.classList.remove("is-open");
    b.setAttribute("aria-expanded", "false");
  }
  function selectedSize(card) {
    var active = $(".size.is-active", card);
    return active ? active.dataset.size : "";
  }
  function selectCardSize(btn) {
    var card = btn.closest(".card");
    var p = byId(card.dataset.id);
    $$(".size", card).forEach(function (s) { s.classList.toggle("is-active", s === btn); });
    var buy = $("[data-wa-buy]", card);
    buy.dataset.size = btn.dataset.size;
    buy.href = waLink(productMessage(p, btn.dataset.size));
  }
  function shakeSizes(box) {
    $$(".size", box).forEach(function (s) {
      s.classList.remove("shake");
      void s.offsetWidth;
      s.classList.add("shake");
    });
    toast("Escolha o tamanho");
  }

  document.addEventListener("click", function (e) {
    var sizeBtn = e.target.closest(".card .size");
    if (sizeBtn) { selectCardSize(sizeBtn); return; }

    var buy = e.target.closest("a[data-wa-buy]");
    if (buy) {
      var card = buy.closest(".card");
      var size = buy.dataset.size || selectedSize(card);
      var product = byId(buy.dataset.waBuy);
      if (!size) { e.preventDefault(); shakeSizes(card); return; }
      buy.href = waLink(productMessage(product, size));
      track("click_comprar", { item_name: product.name, size: size });
      return;
    }

    var open = e.target.closest("[data-open]");
    if (open) { openProduct(open.dataset.open); return; }

    var chip = e.target.closest(".chip");
    if (chip && chip.closest("#filters, #brandFilters, #sizeFilters")) {
      if (chip.dataset.filter) setState({ cat: chip.dataset.filter });
      else if (chip.dataset.brand) setState({ brand: chip.dataset.brand });
      else if (chip.dataset.size) setState({ size: chip.dataset.size });
      return;
    }

    var brandPick = e.target.closest("[data-brand-pick]");
    if (brandPick) {
      setState({ brand: brandPick.dataset.brandPick, cat: "todos", size: "todos" });
      scrollToEl($("#catalogo"));
      closeNav();
      return;
    }

    var a = e.target.closest('a[href^="#"]');
    if (!a) return;
    if (a.dataset.filter) setState({ cat: a.dataset.filter, brand: "todas", size: "todos" });
    var target = $(a.getAttribute("href"));
    if (!target) return;
    e.preventDefault();
    scrollToEl(target);
    closeNav();
  });

  $("#burger").addEventListener("click", function () {
    var open = !$("#nav").classList.contains("is-open");
    $("#nav").classList.toggle("is-open", open);
    this.classList.toggle("is-open", open);
    this.setAttribute("aria-expanded", open ? "true" : "false");
  });

  var header = $("#header");
  window.addEventListener("scroll", function () {
    header.classList.toggle("is-scrolled", window.scrollY > 8);
  }, { passive: true });

  /* ---------- Modal ---------- */
  var modal = $("#modal");
  var cur = null;
  var curSize = null;
  function openProduct(id) {
    cur = byId(id);
    if (!cur) return;
    curSize = null;
    var price = priceInfo(cur);
    $("#mImg").src = img(cur.imgs[0]);
    $("#mImg").alt = displayName(cur);
    $("#mName").textContent = displayName(cur);
    $("#mCat").textContent = STORE.CATS[cur.cat];
    $("#mPrice").className = "price" + (price.placeholder ? " is-placeholder" : "");
    $("#mPrice").innerHTML = (price.old ? "<s>" + esc(price.old) + "</s>" : "") + "<b>" + esc(price.current) + "</b>" + (price.off ? '<em class="off">' + price.off + "% OFF</em>" : "");
    $("#mInst").textContent = price.inst;
    $("#mThumbs").innerHTML = cur.imgs.length > 1 ? cur.imgs.map(function (n, i) {
      return '<button type="button" class="' + (i ? "" : "is-active") + '" data-src="' + img(n) + '"><img src="' + img(n) + '" alt=""></button>';
    }).join("") : "";
    var sizes = sizesFor(cur);
    $("#mSizes").innerHTML = sizes.map(function (s) {
      return '<button type="button" class="size" data-size="' + esc(s) + '">' + esc(s) + "</button>";
    }).join("");
    $("#mBuy").href = waLink(productMessage(cur, ""));
    $("#mBuy").dataset.size = "";
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.documentElement.style.overflow = "hidden";
    track("view_item", { item_id: cur.id, item_name: cur.name });
  }
  function closeProduct() {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.documentElement.style.overflow = "";
  }
  $("#mThumbs").addEventListener("click", function (e) {
    var b = e.target.closest("button");
    if (!b) return;
    $$("button", this).forEach(function (x) { x.classList.toggle("is-active", x === b); });
    $("#mImg").src = b.dataset.src;
  });
  $("#mSizes").addEventListener("click", function (e) {
    var b = e.target.closest(".size");
    if (!b || !cur) return;
    curSize = b.dataset.size;
    $$(".size", this).forEach(function (x) { x.classList.toggle("is-active", x === b); });
    $("#mBuy").dataset.size = curSize;
    $("#mBuy").href = waLink(productMessage(cur, curSize));
  });
  $("#mBuy").addEventListener("click", function (e) {
    if (!cur) return;
    if (!curSize) { e.preventDefault(); shakeSizes($("#mSizes")); return; }
    track("click_comprar", { item_name: cur.name, size: curSize });
  });
  $$("[data-close]", modal).forEach(function (b) {
    b.addEventListener("click", closeProduct);
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && modal.classList.contains("is-open")) closeProduct();
  });

  var news = $("#newsForm");
  if (news) news.addEventListener("submit", function (e) {
    e.preventDefault();
    toast("Newsletter em breve. Por enquanto, siga a gente no Instagram.");
  });

  function showSite() {
    document.body.classList.remove("is-loading");
    var pre = $("#pre");
    if (pre) pre.style.display = "none";
  }
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) showSite();
  else window.setTimeout(showSite, 700);
})();
