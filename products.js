/* Catálogo da vitrine.
   Para cada peça: nome, categoria e fotos (img/pN.jpg). Opcionais:
     url:      link da página do produto na Nuvemshop (usado se não houver variação).
     variants: { P: "123", M: "124", G: "125", GG: "126" } com o ID da variação (tamanho) de cada
               peça na Nuvemshop. Com isso o botão Comprar manda o tamanho escolhido direto para o
               carrinho da loja (loja/comprar/ID-1/).
     sizes:    lista de tamanhos, se for diferente do padrão (P, M, G, GG; bonés: Único).
   Preço, estoque, frete e pagamento ficam na Nuvemshop. */
(function (root) {
  var P = [
    // ---- POLOS ----
    { url: "", id: "polo-bloco-azul-gelo", cat: "polos", name: "Polo Color Block Azul Gelo", imgs: [2, 36, 58], tag: "Novo" },
    { url: "", id: "polo-offwhite-lettering", cat: "polos", name: "Polo Off-White Lettering", imgs: [1, 35, 11], },
    { url: "", id: "polo-azul-ceu-faixa-preta", cat: "polos", name: "Polo Azul Céu Faixa Preta", imgs: [10, 66, 45], tag: "Mais pedido" },
    { url: "", id: "polo-marinho-tricolor", cat: "polos", name: "Polo Marinho Bloco Tricolor", imgs: [7, 67, 40], },
    { url: "", id: "polo-preto-faixa-vermelha", cat: "polos", name: "Polo Preto Faixa Vermelha", imgs: [38], },
    { url: "", id: "polo-preto-listra", cat: "polos", name: "Polo Preto Listra Horizontal", imgs: [63, 52], },
    { url: "", id: "polo-preto-faixa-azul", cat: "polos", name: "Polo Preto Faixa Azul Royal", imgs: [54, 70], },
    { url: "", id: "polo-branco-neon", cat: "polos", name: "Polo Branco Detalhe Neon", imgs: [17, 20], },
    { url: "", id: "polo-marinho-neon", cat: "polos", name: "Polo Marinho Detalhe Neon", imgs: [41, 64], },
    { url: "", id: "polo-verde-monograma", cat: "polos", name: "Polo Verde Monograma", imgs: [31, 61, 50], },
    { url: "", id: "polo-verde-torneio", cat: "polos", name: "Polo Verde Escuro Edição Torneio", imgs: [62, 15], },
    { url: "", id: "polo-marinho-digital", cat: "polos", name: "Polo Marinho Estampa Digital", imgs: [13, 51], },
    { url: "", id: "polo-preto-atleta", cat: "polos", name: "Polo Preto Estampa Atleta", imgs: [33, 21], },
    { url: "", id: "polo-classico-branco", cat: "polos", name: "Polo Clássico Branco", imgs: [42], },
    // ---- CAMISETAS ----
    { url: "", id: "camiseta-dragao-vermelho", cat: "camisetas", name: "Camiseta Dragão Vermelho", imgs: [0, 44], tag: "Novo" },
    { url: "", id: "camiseta-preta-logo-coral", cat: "camisetas", name: "Camiseta Preta Logo Coral", imgs: [4, 32], },
    { url: "", id: "camiseta-grafite-turquesa", cat: "camisetas", name: "Camiseta Grafite Azul-Turquesa", imgs: [5, 9, 28], },
    { url: "", id: "camiseta-jacare-lateral", cat: "camisetas", name: "Camiseta Preta Jacaré Lateral", imgs: [12, 22], },
    { url: "", id: "camiseta-offwhite-grafica", cat: "camisetas", name: "Camiseta Off-White Gráfica", imgs: [23, 6], },
    { url: "", id: "camiseta-preta-fita-lateral", cat: "camisetas", name: "Camiseta Preta Fita Lateral", imgs: [53, 8], },
    { url: "", id: "camiseta-preta-linha-lateral", cat: "camisetas", name: "Camiseta Preta Linha Lateral", imgs: [25, 18], },
    { url: "", id: "camiseta-preta-minimal", cat: "camisetas", name: "Camiseta Preta Minimal", imgs: [49, 16], },
    { url: "", id: "camiseta-preta-faixa-central", cat: "camisetas", name: "Camiseta Preta Faixa Central", imgs: [24], },
    { url: "", id: "camiseta-script-vermelho", cat: "camisetas", name: "Camiseta Preta Script Vermelho", imgs: [47, 26], },
    { url: "", id: "camiseta-fita-italia", cat: "camisetas", name: "Camiseta Preta Fita Itália", imgs: [27, 43], },
    { url: "", id: "camiseta-swoosh-gigante", cat: "camisetas", name: "Camiseta Preta Swoosh Gigante", imgs: [69, 37, 56], tag: "Mais pedido" },
    { url: "", id: "camiseta-ilustracao-pop", cat: "camisetas", name: "Camiseta Preta Ilustração Pop", imgs: [65, 71, 57], },
    { url: "", id: "camiseta-cinza-gelo", cat: "camisetas", name: "Camiseta Cinza Gelo Básica", imgs: [68, 46, 55], },
    { url: "", id: "camiseta-marinho-gola", cat: "camisetas", name: "Camiseta Marinho Gola Contraste", imgs: [59], },
    // ---- CONJUNTOS ----
    { url: "", id: "conjunto-preto-rosa", cat: "conjuntos", name: "Conjunto Preto Estampa Rosa", imgs: [14, 39], tag: "Conjunto" },
    { url: "", id: "conjunto-preto-laranja", cat: "conjuntos", name: "Conjunto Preto Estampa Laranja", imgs: [29, 34], tag: "Conjunto" },
    { url: "", id: "conjunto-preto-texturizado", cat: "conjuntos", name: "Conjunto Preto Texturizado", imgs: [19], tag: "Conjunto" },
    { url: "", id: "conjunto-polo-bermuda", cat: "conjuntos", name: "Conjunto Preto Polo + Bermuda", imgs: [60], tag: "Conjunto" },
    // ---- BONÉS ----
    { url: "", id: "bone-preto-aba-curva", cat: "bones", name: "Boné Preto Aba Curva", imgs: [3], },
    { url: "", id: "bone-aba-curva-trio", cat: "bones", name: "Bonés Aba Curva Branco e Preto", imgs: [30], },
    { url: "", id: "bone-monograma", cat: "bones", name: "Boné Monograma Bege e Preto", imgs: [48], }
  ];

  var CATS = { polos: "Polo", camisetas: "Camiseta", conjuntos: "Conjunto", bones: "Boné" };

  /* Marca de cada peça (id -> marca). Peças fora da lista entram em "Outras marcas".
     Para trocar a marca de uma peça, edite aqui. */
  var BRANDS = {
    "camiseta-dragao-vermelho": "Nike",
    "camiseta-preta-linha-lateral": "Armani Exchange",
    "camiseta-script-vermelho": "Corteiz",
    "camiseta-ilustracao-pop": "Nike",
    "conjunto-preto-rosa": "Balmain",
    "bone-aba-curva-trio": "Tommy Hilfiger",
    "polo-bloco-azul-gelo": "Tommy Hilfiger",
    "polo-offwhite-lettering": "Tommy Hilfiger",
    "polo-azul-ceu-faixa-preta": "Tommy Hilfiger",
    "polo-marinho-tricolor": "Tommy Hilfiger",
    "polo-preto-faixa-vermelha": "Tommy Hilfiger",
    "polo-preto-listra": "Tommy Hilfiger",
    "polo-classico-branco": "Tommy Hilfiger",
    "camiseta-preta-fita-lateral": "Tommy Hilfiger",
    "camiseta-preta-minimal": "Tommy Hilfiger",
    "camiseta-cinza-gelo": "Tommy Hilfiger",
    "camiseta-marinho-gola": "Tommy Hilfiger",
    "polo-preto-faixa-azul": "Ralph Lauren",
    "polo-branco-neon": "Lacoste",
    "polo-marinho-neon": "Lacoste",
    "polo-verde-monograma": "Lacoste",
    "polo-verde-torneio": "Lacoste",
    "polo-marinho-digital": "Lacoste",
    "polo-preto-atleta": "Lacoste",
    "camiseta-jacare-lateral": "Lacoste",
    "conjunto-polo-bermuda": "Lacoste",
    "camiseta-preta-logo-coral": "Nike",
    "camiseta-swoosh-gigante": "Nike",
    "bone-preto-aba-curva": "Nike",
    "camiseta-preta-faixa-central": "Fred Perry",
    "camiseta-fita-italia": "EA7",
    "camiseta-offwhite-grafica": "Emporio Armani",
    "camiseta-grafite-turquesa": "Syna World",
    "conjunto-preto-laranja": "Syna World",
    "bone-monograma": "Gucci"
  };
  var BRAND_ORDER = ["Tommy Hilfiger", "Lacoste", "Nike", "Ralph Lauren", "Fred Perry", "EA7", "Emporio Armani", "Armani Exchange", "Syna World", "Corteiz", "Balmain", "Gucci", "Outras marcas"];
  P.forEach(function (p) { p.brand = BRANDS[p.id] || "Outras marcas"; });

  var api = { PRODUCTS: P, CATS: CATS, BRANDS: BRAND_ORDER };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.LS_STORE = api;
})(typeof window !== "undefined" ? window : globalThis);
