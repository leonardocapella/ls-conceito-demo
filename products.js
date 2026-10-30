/* Estrutura do catálogo da vitrine. Os produtos vêm de catalogo.js (API da Nuvemshop, somente leitura):
   cada peça tem nsId (id do produto na loja), url (página na loja), imgs (CDN da Nuvemshop),
   sizes (tamanhos com estoque) e variants { tamanho: id da variação } para o carrinho da Nuvemshop. */
(function (root) {
  /* Produtos reais vindos da API da Nuvemshop (catalogo.js, gerado por tools/sync-nuvemshop.py). */
  var P = (root.LS_CATALOGO || []).slice();
  var CATS_PLURAL = { camisetas: "Camisetas", polos: "Polos", calcas: "Calças", bermudas: "Bermudas", moletons: "Moletons", conjuntos: "Conjuntos", tenis: "Tênis", bones: "Bonés", acessorios: "Acessórios" };
  var CATS = { camisetas: "Camiseta", polos: "Polo", calcas: "Calça", bermudas: "Bermuda", moletons: "Moletom", conjuntos: "Conjunto", tenis: "Tênis", bones: "Boné", acessorios: "Acessório" };

  /* As 16 marcas da faixa de logos, em ordem alfabética (arquivos em img/marcas/<slug>.webp). */
  var BRAND_LOGOS = [
    { name: "Armani Exchange", slug: "armani-exchange" }, { name: "Balmain", slug: "balmain" }, { name: "Boss", slug: "boss" },
    { name: "Brow Jeans", slug: "brow-jeans" }, { name: "Casablanca", slug: "casablanca" }, { name: "Corteiz", slug: "corteiz" },
    { name: "Emporio Armani", slug: "emporio-armani" }, { name: "Fred Perry", slug: "fred-perry" }, { name: "Lacoste", slug: "lacoste" },
    { name: "Mizuno", slug: "mizuno" }, { name: "Moncler", slug: "moncler" }, { name: "Nike", slug: "nike" },
    { name: "Polo Ralph Lauren", slug: "polo-ralph-lauren" }, { name: "Synaworld", slug: "synaworld" }, { name: "Tommy", slug: "tommy" },
    { name: "Zara", slug: "zara" }
  ];
  var EXTRA = [];
  P.forEach(function (p) {
    if (!BRAND_LOGOS.some(function (b) { return b.name === p.brand; }) && EXTRA.indexOf(p.brand) === -1 && p.brand !== "Outras marcas") EXTRA.push(p.brand);
  });
  var BRAND_ORDER = BRAND_LOGOS.map(function (b) { return b.name; }).concat(EXTRA.sort(), ["Outras marcas"]);
  var SIZE_PLACEHOLDER = ["P", "M", "G", "GG"];
  var SIZE_PLACEHOLDER_BONE = ["Único"];

  var api = { PRODUCTS: P, CATS: CATS, CATS_PLURAL: CATS_PLURAL, BRANDS: BRAND_ORDER, BRAND_LOGOS: BRAND_LOGOS, SIZE_PLACEHOLDER: SIZE_PLACEHOLDER, SIZE_PLACEHOLDER_BONE: SIZE_PLACEHOLDER_BONE };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.LS_STORE = api;
})(typeof window !== "undefined" ? window : globalThis);
