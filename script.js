/* LS Conceito — front-end da loja */
(function () {
  "use strict";
  var CFG = window.LS_CONFIG || {};
  var STORE = window.LS_STORE;
  var PRODUCTS = STORE.PRODUCTS;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var hasGsap = typeof gsap !== "undefined";
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var fine = window.matchMedia("(hover:hover) and (pointer:fine)").matches;

  function brl(n) { return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }); }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function img(i) { return "img/p" + i + ".jpg"; }
  function byId(id) { return PRODUCTS.filter(function (p) { return p.id === id; })[0]; }
  function lsGet(k, d) { try { var v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } }
  function lsSet(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  function waLink(text) { return "https://wa.me/" + CFG.whatsapp + "?text=" + encodeURIComponent(text); }

  /* ---------- Tracking (GA4 / Meta Pixel / GTM) ---------- */
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
  var FB_MAP = { view_item: "ViewContent", add_to_cart: "AddToCart", begin_checkout: "InitiateCheckout", purchase: "Purchase" };
  function track(name, p) {
    p = p || {};
    if (window.gtag) gtag("event", name, p);
    if (CFG.gtm) window.dataLayer.push(Object.assign({ event: name }, p));
    if (window.fbq && FB_MAP[name]) fbq("track", FB_MAP[name], { value: p.value, currency: "BRL", content_ids: p.items && p.items.map(function (i) { return i.item_id; }) });
  }

  /* ---------- Links de WhatsApp ---------- */
  $$(".js-whats").forEach(function (a) {
    a.href = waLink("Olá! Vim pelo site da LS Conceito e gostaria de ajuda.");
    a.target = "_blank"; a.rel = "noopener";
  });
  $("#year").textContent = new Date().getFullYear();

  /* ---------- Toast ---------- */
  var toastT;
  function toast(msg) {
    var t = $("#toast"); t.textContent = msg;
    if (hasGsap) { gsap.killTweensOf(t); gsap.fromTo(t, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: .45, ease: "power3.out" }); clearTimeout(toastT); toastT = setTimeout(function () { gsap.to(t, { opacity: 0, y: 40, duration: .4 }); }, 2600); }
    else { t.style.opacity = 1; t.style.transform = "translate(-50%,0)"; clearTimeout(toastT); toastT = setTimeout(function () { t.style.opacity = 0; }, 2600); }
  }

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
    if (!a || a.getAttribute("href") === "#") return;
    var t = $(a.getAttribute("href"));
    if (!t) return;
    e.preventDefault(); scrollToEl(t);
    $("#nav").classList.remove("is-open"); $("#burger").classList.remove("is-open");
  });
  $("#burger").addEventListener("click", function () {
    this.classList.toggle("is-open"); $("#nav").classList.toggle("is-open");
  });

  /* ---------- Header ---------- */
  var header = $("#header"), lastY = 0;
  window.addEventListener("scroll", function () {
    var y = window.scrollY;
    header.classList.toggle("is-scrolled", y > 40);
    lastY = y;
  }, { passive: true });

  /* ---------- Catálogo ---------- */
  var grid = $("#grid");
  PRODUCTS.forEach(function (p) {
    var el = document.createElement("article");
    el.className = "card"; el.dataset.cat = p.cat; el.dataset.id = p.id;
    el.innerHTML =
      '<button class="card-media" data-open="' + p.id + '" data-cursor="Ver" aria-label="Ver ' + esc(p.name) + '">' +
      (p.tag ? '<span class="card-tag">' + esc(p.tag) + "</span>" : "") +
      '<img src="' + img(p.imgs[0]) + '" alt="' + esc(p.name) + '" loading="lazy">' +
      (p.imgs[1] !== undefined ? '<img class="alt" src="' + img(p.imgs[1]) + '" alt="" loading="lazy">' : "") +
      '<span class="card-quick">Ver detalhes</span></button>' +
      '<div class="card-body"><h3>' + esc(p.name) + "</h3>" +
      '<div class="card-price">' + brl(p.price) + "<small>em até 12x no cartão</small></div>" +
      '<button class="card-btn" data-open="' + p.id + '" data-cursor>Comprar <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M13 6l6 6-6 6"/></svg></button></div>';
    grid.appendChild(el);
  });
  grid.addEventListener("click", function (e) {
    var b = e.target.closest("[data-open]"); if (b) openProduct(b.dataset.open);
  });

  var filter = "todos";
  function applyFilter(f) {
    filter = f;
    $$(".chip").forEach(function (c) { c.classList.toggle("is-active", c.dataset.filter === f); });
    var cards = $$(".card");
    var show = cards.filter(function (c) { return f === "todos" || c.dataset.cat === f; });
    function swap() {
      cards.forEach(function (c) { c.style.display = show.indexOf(c) > -1 ? "" : "none"; });
      if (hasGsap) gsap.fromTo(show, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: .55, stagger: .04, ease: "power3.out", overwrite: true, onComplete: function () { ScrollTrigger.refresh(); } });
    }
    if (hasGsap) gsap.to(cards.filter(function (c) { return c.style.display !== "none"; }), { opacity: 0, y: 20, duration: .2, onComplete: swap }); else swap();
  }
  $("#filters").addEventListener("click", function (e) {
    var c = e.target.closest(".chip"); if (c) applyFilter(c.dataset.filter);
  });
  $$("a[data-filter]").forEach(function (c) { c.addEventListener("click", function () { applyFilter(c.dataset.filter); }); });

  /* ---------- Modal do produto ---------- */
  var modal = $("#modal"), cur = null, curSize = null;
  function openLayer(layer, card) {
    layer.classList.add("is-open"); layer.setAttribute("aria-hidden", "false"); lock(true);
    if (hasGsap) {
      gsap.fromTo($(".modal-bg,.drawer-bg", layer), { opacity: 0 }, { opacity: 1, duration: .35 });
      gsap.fromTo(card, { opacity: 0, y: 50, scale: .96 }, { opacity: 1, y: 0, scale: 1, duration: .55, ease: "power3.out" });
    } else { $(".modal-bg,.drawer-bg", layer).style.opacity = 1; card.style.opacity = 1; }
  }
  function closeLayer(layer, card) {
    function done() { layer.classList.remove("is-open"); layer.setAttribute("aria-hidden", "true"); if (!$(".is-open", document.body)) lock(false); }
    if (hasGsap) { gsap.to($(".modal-bg,.drawer-bg", layer), { opacity: 0, duration: .3 }); gsap.to(card, { opacity: 0, y: 30, duration: .3, onComplete: done }); } else done();
  }
  function setMainImg(src) {
    var m = $("#mImg");
    if (!hasGsap) { m.src = src; return; }
    gsap.to(m, { opacity: 0, duration: .15, onComplete: function () { m.src = src; gsap.to(m, { opacity: 1, duration: .3 }); } });
  }
  function openProduct(id) {
    cur = byId(id); curSize = cur.sizes.length === 1 ? cur.sizes[0] : null;
    $("#mImg").src = img(cur.imgs[0]); $("#mImg").alt = cur.name;
    $("#mName").textContent = cur.name;
    $("#mCat").textContent = STORE.CATS[cur.cat] + " · LS Conceito";
    $("#mPrice").textContent = brl(cur.price);
    $("#mThumbs").innerHTML = cur.imgs.map(function (n, i) { return '<button type="button" class="' + (i ? "" : "is-active") + '" data-src="' + img(n) + '"><img src="' + img(n) + '" alt=""></button>'; }).join("");
    $("#mSizes").innerHTML = cur.sizes.map(function (s) { return '<button type="button" class="size' + (s === curSize ? " is-active" : "") + '" data-size="' + s + '">' + s + "</button>"; }).join("");
    $("#mBtn").href = waLink("Olá! Tenho uma dúvida sobre: " + cur.name);
    openLayer(modal, $(".modal-card", modal));
    track("view_item", { currency: "BRL", value: cur.price, items: [{ item_id: cur.id, item_name: cur.name, price: cur.price }] });
  }
  $("#mThumbs").addEventListener("click", function (e) {
    var b = e.target.closest("button"); if (!b) return;
    $$("button", this).forEach(function (x) { x.classList.toggle("is-active", x === b); }); setMainImg(b.dataset.src);
  });
  $("#mSizes").addEventListener("click", function (e) {
    var b = e.target.closest(".size"); if (!b) return;
    curSize = b.dataset.size; $$(".size", this).forEach(function (x) { x.classList.toggle("is-active", x === b); });
  });
  $("#mAdd").addEventListener("click", function () {
    if (!curSize) {
      $$("#mSizes .size").forEach(function (s) { s.classList.remove("shake"); void s.offsetWidth; s.classList.add("shake"); });
      toast("Escolha um tamanho"); return;
    }
    addToCart(cur.id, curSize);
    closeLayer(modal, $(".modal-card", modal));
    setTimeout(openCart, 350);
  });
  $$("[data-close]", modal).forEach(function (b) { b.addEventListener("click", function () { closeLayer(modal, $(".modal-card", modal)); }); });

  /* ---------- Carrinho ---------- */
  var cart = lsGet("ls_cart", []);          // [{id,size,qty}]
  var ship = lsGet("ls_ship", null);        // {cep,uf,cidade}
  var drawer = $("#drawer"), panel = $(".drawer-panel", drawer);
  function saveCart() { lsSet("ls_cart", cart); }
  function subtotal() { return cart.reduce(function (s, i) { return s + byId(i.id).price * i.qty; }, 0); }
  function count() { return cart.reduce(function (s, i) { return s + i.qty; }, 0); }
  function freteAtual() { return ship ? STORE.frete(ship.uf, subtotal()) : null; }

  function addToCart(id, size) {
    var it = cart.filter(function (i) { return i.id === id && i.size === size; })[0];
    if (it) it.qty++; else cart.push({ id: id, size: size, qty: 1 });
    saveCart(); renderCart();
    var p = byId(id);
    track("add_to_cart", { currency: "BRL", value: p.price, items: [{ item_id: p.id, item_name: p.name, price: p.price, quantity: 1 }] });
    if (hasGsap) gsap.fromTo("#cartCount", { scale: 1.8 }, { scale: 1, duration: .5, ease: "back.out(3)" });
  }
  function renderCart() {
    $("#cartCount").textContent = count();
    var body = $("#drawerBody");
    if (!cart.length) {
      body.innerHTML = '<div class="empty"><b>Carrinho vazio</b>Escolha uma peça no catálogo para começar.</div>';
      $("#drawerFoot").style.display = "none"; return;
    }
    $("#drawerFoot").style.display = "";
    body.innerHTML = cart.map(function (i, k) {
      var p = byId(i.id);
      return '<div class="ci"><img src="' + img(p.imgs[0]) + '" alt=""><div><h4>' + esc(p.name) + "</h4><small>Tamanho " + esc(i.size) + " · " + brl(p.price) + '</small><div class="qty"><button data-q="-1" data-k="' + k + '" aria-label="Diminuir">−</button><span>' + i.qty + '</span><button data-q="1" data-k="' + k + '" aria-label="Aumentar">+</button></div></div><div class="ci-right"><span>' + brl(p.price * i.qty) + '</span><button class="ci-rm" data-rm="' + k + '">remover</button></div></div>';
    }).join("");
    var sub = subtotal(), f = freteAtual(), total = sub + (f ? f.valor : 0);
    $("#sumSub").textContent = brl(sub);
    $("#sumShip").textContent = f ? (f.gratis ? "Grátis" : brl(f.valor)) : "—";
    $("#sumTotal").textContent = brl(total);
    $("#sumInst").textContent = "ou em até 12x no cartão";
    if (f) $("#cepMsg").textContent = "Entrega em " + (ship.cidade ? ship.cidade + "/" : "") + ship.uf + " · " + f.prazo + (f.gratis ? " · frete grátis" : "");
    else if (sub < STORE.FRETE_GRATIS_ACIMA) $("#cepMsg").textContent = "Frete grátis acima de " + brl(STORE.FRETE_GRATIS_ACIMA);
  }
  $("#drawerBody").addEventListener("click", function (e) {
    var q = e.target.closest("[data-q]"), r = e.target.closest("[data-rm]");
    if (q) { var it = cart[+q.dataset.k]; it.qty += +q.dataset.q; if (it.qty < 1) cart.splice(+q.dataset.k, 1); }
    if (r) cart.splice(+r.dataset.rm, 1);
    if (q || r) { saveCart(); renderCart(); }
  });
  function openCart() { openLayer(drawer, panel); if (hasGsap) gsap.fromTo(panel, { x: "100%", opacity: 1, y: 0, scale: 1 }, { x: 0, duration: .6, ease: "power4.out" }); }
  function closeCart() {
    if (hasGsap) { gsap.to($(".drawer-bg", drawer), { opacity: 0, duration: .3 }); gsap.to(panel, { x: "100%", duration: .45, ease: "power3.in", onComplete: function () { drawer.classList.remove("is-open"); if (!$("#checkout.is-open") && !modal.classList.contains("is-open")) lock(false); } }); }
    else { drawer.classList.remove("is-open"); lock(false); }
  }
  $("#cartBtn").addEventListener("click", openCart);
  $$("[data-close-cart]").forEach(function (b) { b.addEventListener("click", closeCart); });
  document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape") return;
    if ($("#checkout.is-open")) closeCheckout(); else if (drawer.classList.contains("is-open")) closeCart(); else if (modal.classList.contains("is-open")) closeLayer(modal, $(".modal-card", modal));
  });

  /* CEP */
  /* Máscara 00000-000; chama onFull() assim que o CEP está completo */
  function maskCep(inp, onFull) {
    inp.addEventListener("input", function () {
      var v = inp.value.replace(/\D/g, "").slice(0, 8);
      inp.value = v.length > 5 ? v.slice(0, 5) + "-" + v.slice(5) : v;
      inp.classList.remove("bad");
      if (v.length === 8 && onFull) onFull();
    });
  }
  function lookupCep(cep) {
    cep = cep.replace(/\D/g, "");
    if (cep.length !== 8) return Promise.reject(new Error("CEP inválido"));
    return fetch("https://viacep.com.br/ws/" + cep + "/json/").then(function (r) { return r.json(); }).then(function (d) { if (d.erro) throw new Error("CEP não encontrado"); return d; });
  }
  maskCep($("#cepInput"), function () { calcShip(); });
  maskCep($('#checkoutForm [name="cep"]'), function () { fillFromCep(); });

  /* Telefone: (51) 99999-9999 (celular) ou (51) 3333-4444 (fixo) */
  function fmtPhone(v) {
    var d = String(v).replace(/\D/g, "").slice(0, 11);
    if (d.length > 10) return "(" + d.slice(0, 2) + ") " + d.slice(2, 7) + "-" + d.slice(7);
    if (d.length > 6) return "(" + d.slice(0, 2) + ") " + d.slice(2, 6) + "-" + d.slice(6);
    if (d.length > 2) return "(" + d.slice(0, 2) + ") " + d.slice(2);
    if (d.length > 0) return "(" + d;
    return "";
  }
  var phoneInp = $('#checkoutForm [name="whatsapp"]');
  phoneInp.addEventListener("input", function () {
    var atEnd = phoneInp.selectionStart === phoneInp.value.length;
    phoneInp.value = fmtPhone(phoneInp.value);
    if (atEnd) phoneInp.setSelectionRange(phoneInp.value.length, phoneInp.value.length);
  });
  $("#cepInput").value = ship ? ship.cep : "";
  function calcShip() {
    var msg = $("#cepMsg"); msg.textContent = "Buscando...";
    lookupCep($("#cepInput").value).then(function (d) {
      ship = { cep: $("#cepInput").value, uf: d.uf, cidade: d.localidade, rua: d.logradouro, bairro: d.bairro };
      if (!STORE.frete(ship.uf, 0)) throw new Error("Não entregamos nessa região");
      lsSet("ls_ship", ship); renderCart();
    }).catch(function (err) { ship = null; msg.textContent = err.message; renderCart(); $("#cepMsg").textContent = err.message; });
  }
  $("#cepBtn").addEventListener("click", calcShip);
  $("#cepInput").addEventListener("keydown", function (e) { if (e.key === "Enter") { e.preventDefault(); calcShip(); } });

  /* ---------- Checkout ---------- */
  var checkout = $("#checkout"), form = $("#checkoutForm");
  function closeCheckout() { closeLayer(checkout, form); }
  $$("[data-close-checkout]").forEach(function (b) { b.addEventListener("click", closeCheckout); });
  $("#goCheckout").addEventListener("click", function () {
    if (!freteAtual()) { $("#cepMsg").textContent = "Calcule o frete para continuar"; $("#cepInput").focus(); return; }
    var f = freteAtual(), sub = subtotal();
    $("#coItems").innerHTML = cart.map(function (i) { var p = byId(i.id); return '<div class="co-item"><img src="' + img(p.imgs[0]) + '" alt=""><span>' + esc(p.name) + "<br><small class='muted'>Tam. " + esc(i.size) + " · " + i.qty + "x</small></span><b>" + brl(p.price * i.qty) + "</b></div>"; }).join("");
    refreshCo();
    form.cep.value = ship.cep; form.uf.value = ship.uf; form.cidade.value = ship.cidade || ""; if (ship.rua && !form.rua.value) form.rua.value = ship.rua; if (ship.bairro && !form.bairro.value) form.bairro.value = ship.bairro;
    var saved = lsGet("ls_customer", {}); ["nome", "email", "whatsapp"].forEach(function (k) { if (saved[k] && !form[k].value) form[k].value = k === "whatsapp" ? fmtPhone(saved[k]) : saved[k]; });
    $("#coErr").textContent = "";
    closeCart(); setTimeout(function () { openLayer(checkout, form); }, 450);
    track("begin_checkout", { currency: "BRL", value: sub + f.valor, items: cart.map(function (i) { var p = byId(i.id); return { item_id: p.id, item_name: p.name, price: p.price, quantity: i.qty }; }) });
  });
  /* Resumo do checkout (recalculado se o CEP mudar) */
  function refreshCo() {
    var f = freteAtual(), sub = subtotal();
    $("#coSub").textContent = brl(sub);
    $("#coShip").textContent = f ? (f.gratis ? "Grátis" : brl(f.valor)) : "-";
    $("#coTotal").textContent = brl(sub + (f ? f.valor : 0));
  }
  /* Ao completar o CEP no checkout, preenche o endereço e atualiza o frete */
  var cepReq = 0;
  function fillFromCep() {
    var mine = ++cepReq, err = $("#coErr");
    err.textContent = "Buscando endereço...";
    lookupCep(form.cep.value).then(function (d) {
      if (mine !== cepReq) return;
      if (!STORE.frete(d.uf, 0)) throw new Error("Ainda não entregamos nessa região.");
      form.rua.value = d.logradouro || ""; form.bairro.value = d.bairro || "";
      form.cidade.value = d.localidade; form.uf.value = d.uf;
      ship = { cep: form.cep.value, uf: d.uf, cidade: d.localidade, rua: d.logradouro, bairro: d.bairro };
      lsSet("ls_ship", ship); $("#cepInput").value = ship.cep;
      renderCart(); refreshCo(); err.textContent = "";
      (d.logradouro ? form.numero : form.rua).focus();
    }).catch(function (ex) {
      if (mine !== cepReq) return;
      form.cep.classList.add("bad"); err.textContent = ex.message === "Failed to fetch" ? "Não foi possível consultar o CEP agora. Preencha o endereço manualmente." : ex.message;
    });
  }
  /* UF: só letras maiúsculas */
  form.uf.addEventListener("input", function () { form.uf.value = form.uf.value.replace(/[^a-zA-Z]/g, "").toUpperCase().slice(0, 2); });
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var err = $("#coErr"), bad = false;
    $$("input[required]", form).forEach(function (i) { var b = !i.value.trim(); i.classList.toggle("bad", b); if (b) bad = true; });
    if (bad) { err.textContent = "Preencha os campos destacados."; return; }
    if (form.cep.value.replace(/\D/g, "").length !== 8) { err.textContent = "Informe o CEP completo (00000-000)."; form.cep.classList.add("bad"); form.cep.focus(); return; }
    if (!STORE.frete(form.uf.value, 0)) { err.textContent = "Informe uma UF válida (ex.: RS)."; form.uf.classList.add("bad"); form.uf.focus(); return; }
    var digits = form.whatsapp.value.replace(/\D/g, "");
    if (digits.length < 10 || digits.length > 11 || /^(\d)\1+$/.test(digits) || +digits.slice(0, 2) < 11) { err.textContent = "Informe um telefone válido com DDD, ex.: (51) 99999-9999."; form.whatsapp.classList.add("bad"); form.whatsapp.focus(); return; }
    if (!/^\S+@\S+\.\S+$/.test(form.email.value)) { err.textContent = "E-mail inválido."; form.email.classList.add("bad"); return; }
    var btn = $("#coPay"); btn.disabled = true; btn.firstChild.textContent = "Aguarde...";
    var payload = {
      customer: { nome: form.nome.value.trim(), email: form.email.value.trim(), whatsapp: form.whatsapp.value.trim() },
      address: { cep: form.cep.value, rua: form.rua.value, numero: form.numero.value, complemento: form.complemento.value, bairro: form.bairro.value, cidade: form.cidade.value, uf: form.uf.value.toUpperCase() },
      items: cart.map(function (i) { return { id: i.id, size: i.size, qty: i.qty }; })
    };
    lsSet("ls_customer", payload.customer);
    fetch("api/checkout", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) })
      .then(function (r) { return r.json().then(function (d) { if (!r.ok) throw new Error(d.error || "Erro ao iniciar o pagamento"); return d; }); })
      .then(function (d) {
        lsSet("ls_last_order", { order: d.order, total: d.total, email: payload.customer.email });
        window.location.href = d.init_point;
      })
      .catch(function (ex) {
        btn.disabled = false; btn.firstChild.textContent = "Ir para o pagamento";
        err.textContent = (ex instanceof SyntaxError || ex.message === "Failed to fetch") ? "Versão de demonstração: o pagamento será ativado quando a loja for publicada." : ex.message;
      });
  });

  /* ---------- Rastreio ---------- */
  var STEPS = ["Pedido recebido", "Pagamento aprovado", "Enviado", "Entregue"];
  function trackLookup(order, email) {
    var out = $("#trackResult"); out.innerHTML = '<div class="tr-card">Buscando pedido...</div>';
    fetch("api/track?order=" + encodeURIComponent(order) + "&email=" + encodeURIComponent(email))
      .then(function (r) { return r.json().then(function (d) { if (!r.ok) throw new Error(d.error || "Pedido não encontrado"); return d; }); })
      .then(function (d) {
        var steps = STEPS.map(function (s, i) { return '<div class="tr-s' + (i <= d.step ? " done" : "") + '"><i></i>' + s + "</div>"; }).join("");
        out.innerHTML = '<div class="tr-card"><b>Pedido ' + esc(d.order) + "</b> · " + esc(d.statusLabel) + '<div class="tr-steps">' + steps + "</div>" +
          (d.trackingCode ? '<div class="tr-code">Código de rastreio: <b>' + esc(d.trackingCode) + '</b> · <a href="https://www.linkcorreios.com.br/?id=' + encodeURIComponent(d.trackingCode) + '" target="_blank" rel="noopener">acompanhar nos Correios</a></div>' : '<div class="tr-code muted">O código de rastreio aparece aqui assim que o pedido for enviado.</div>') + "</div>";
      })
      .catch(function (ex) { out.innerHTML = '<div class="tr-card err">' + esc((ex instanceof SyntaxError || ex.message === "Failed to fetch") ? "Versão de demonstração: o rastreio será ativado quando a loja for publicada." : ex.message) + "</div>"; });
  }
  $("#trackForm").addEventListener("submit", function (e) { e.preventDefault(); trackLookup(this.order.value.trim(), this.email.value.trim()); });

  /* retorno do Mercado Pago */
  (function () {
    var q = new URLSearchParams(location.search), st = q.get("status"), order = q.get("pedido");
    if (!st) return;
    var last = lsGet("ls_last_order", {});
    if (st === "sucesso" || st === "pendente") {
      if (st === "sucesso" && last.order === order) track("purchase", { transaction_id: order, currency: "BRL", value: last.total });
      cart = []; saveCart(); renderCart();
      var f = $("#trackForm"); if (order) f.order.value = order; if (last.email) f.email.value = last.email;
      setTimeout(function () { var s = $("#rastreio"); if (s) scrollToEl(s); toast(st === "sucesso" ? "Pagamento aprovado! Obrigado pela compra 🦁" : "Pedido recebido. Aguardando confirmação do pagamento."); if (order && last.email) trackLookup(order, last.email); }, 1800);
    } else toast("O pagamento não foi concluído. Seu carrinho foi mantido.");
    history.replaceState(null, "", location.pathname);
  })();

  renderCart();

  /* ---------- Destaques (monta os slides) ---------- */
  var FEATURED = ["polo-azul-ceu-faixa-preta", "camiseta-dragao-vermelho", "conjunto-preto-laranja", "camiseta-swoosh-gigante"];
  var stage = $("#showStage");
  FEATURED.forEach(function (id, k) {
    var p = byId(id), s = document.createElement("article");
    s.className = "slide";
    s.innerHTML = '<div class="slide-img"><img src="' + img(p.imgs[0]) + '" alt="' + esc(p.name) + '"></div>' +
      '<div class="slide-info"><span class="slide-no">0' + (k + 1) + '</span><span class="tag">' + STORE.CATS[p.cat] + '</span><h3>' + esc(p.name) + '</h3>' +
      '<div class="slide-price">' + brl(p.price) + '</div><p>Em até 12x no cartão ou Pix. Escolha o tamanho e adicione ao carrinho.</p>' +
      '<button class="btn btn-gold" data-open="' + p.id + '"><span>Comprar</span></button></div>';
    stage.appendChild(s);
  });
  $("#showTotal").textContent = "0" + FEATURED.length;
  stage.addEventListener("click", function (e) { var b = e.target.closest("[data-open]"); if (b) openProduct(b.dataset.open); });

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
  gsap.set(".kicker, .lead, .hero-cta", { opacity: 0, y: 20 });
  gsap.set(".hero .line-in", { yPercent: 110 });
  gsap.set(".hm", { clipPath: "inset(0 0 100% 0)" });

  function intro() {
    document.body.classList.remove("is-loading");
    gsap.timeline({ defaults: { ease: "power3.out" } })
      .to(".kicker", { opacity: 1, y: 0, duration: .7 })
      .to(".hero .line-in", { yPercent: 0, duration: 1, stagger: .12, ease: "power4.out" }, "-=.4")
      .to(".lead, .hero-cta", { opacity: 1, y: 0, duration: .8, stagger: .1 }, "-=.6")
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
