/* Páginas institucionais: só o básico do header (menu, barra de avisos, WhatsApp, grupo). */
(function () {
  "use strict";
  var CFG = window.LS_CONFIG || {};
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var REDUCE = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  var wa = "https://wa.me/" + CFG.whatsapp + "?text=" + encodeURIComponent("Olá! Vim pelo site da LS Conceito e gostaria de ajuda.");
  $$(".js-whats").forEach(function (a) { a.href = wa; a.target = "_blank"; a.rel = "noopener"; });
  var year = $("#year");
  if (year) year.textContent = new Date().getFullYear();

  var avisos = CFG.avisos && CFG.avisos.length ? CFG.avisos : ["Enviamos para todo o Brasil"];
  var box = $("#topbarMsgs");
  box.innerHTML = avisos.map(function (a, i) {
    return '<p class="topbar-msg' + (i ? "" : " is-on") + '"' + (i ? ' aria-hidden="true"' : "") + ">" + esc(a) + "</p>";
  }).join("");
  if (avisos.length > 1 && !REDUCE) {
    var idx = 0;
    setInterval(function () {
      var msgs = $$(".topbar-msg", box);
      idx = (idx + 1) % msgs.length;
      msgs.forEach(function (m, i) { m.classList.toggle("is-on", i === idx); m.setAttribute("aria-hidden", i === idx ? "false" : "true"); });
    }, 4500);
  }

  var burger = $("#burger");
  burger.addEventListener("click", function () {
    var open = !$("#nav").classList.contains("is-open");
    $("#nav").classList.toggle("is-open", open);
    burger.classList.toggle("is-open", open);
    burger.setAttribute("aria-expanded", open ? "true" : "false");
  });

  var header = $("#header");
  window.addEventListener("scroll", function () { header.classList.toggle("is-scrolled", window.scrollY > 40); }, { passive: true });

  var toastT;
  document.addEventListener("click", function (e) {
    var g = e.target.closest("[data-grupo]");
    if (!g) return;
    if (CFG.grupoNovidades) { g.href = CFG.grupoNovidades; g.target = "_blank"; g.rel = "noopener"; return; }
    e.preventDefault();
    var t = $("#toast");
    t.textContent = "O link do grupo de novidades chega em breve. Enquanto isso, chame a loja no WhatsApp.";
    t.classList.add("is-on");
    clearTimeout(toastT);
    toastT = setTimeout(function () { t.classList.remove("is-on"); }, 3200);
  });
})();
