/* Catálogo + regras de frete.
   Usado pelo site (navegador) e pelo servidor (api/*), assim o preço final
   é sempre recalculado no servidor e não pode ser adulterado pelo cliente.
   >>> Os PREÇOS abaixo são EXEMPLOS. Substituir pelos valores reais do cliente. <<<
*/
(function (root) {
  var TAM = ["P", "M", "G", "GG"];
  var P = [
    // ---- POLOS ----
    { id: "polo-bloco-azul-gelo", cat: "polos", name: "Polo Color Block Azul Gelo", price: 129.9, imgs: [2, 36, 58], sizes: TAM, tag: "Novo" },
    { id: "polo-offwhite-lettering", cat: "polos", name: "Polo Off-White Lettering", price: 129.9, imgs: [1, 35, 11], sizes: TAM },
    { id: "polo-azul-ceu-faixa-preta", cat: "polos", name: "Polo Azul Céu Faixa Preta", price: 129.9, imgs: [10, 66, 45], sizes: TAM, tag: "Mais pedido" },
    { id: "polo-marinho-tricolor", cat: "polos", name: "Polo Marinho Bloco Tricolor", price: 129.9, imgs: [7, 67, 40], sizes: TAM },
    { id: "polo-preto-faixa-vermelha", cat: "polos", name: "Polo Preto Faixa Vermelha", price: 129.9, imgs: [38], sizes: TAM },
    { id: "polo-preto-listra", cat: "polos", name: "Polo Preto Listra Horizontal", price: 129.9, imgs: [63, 52], sizes: TAM },
    { id: "polo-preto-faixa-azul", cat: "polos", name: "Polo Preto Faixa Azul Royal", price: 129.9, imgs: [54, 70], sizes: TAM },
    { id: "polo-branco-neon", cat: "polos", name: "Polo Branco Detalhe Neon", price: 139.9, imgs: [17, 20], sizes: TAM },
    { id: "polo-marinho-neon", cat: "polos", name: "Polo Marinho Detalhe Neon", price: 139.9, imgs: [41, 64], sizes: TAM },
    { id: "polo-verde-monograma", cat: "polos", name: "Polo Verde Monograma", price: 139.9, imgs: [31, 61, 50], sizes: TAM },
    { id: "polo-verde-torneio", cat: "polos", name: "Polo Verde Escuro Edição Torneio", price: 139.9, imgs: [62, 15], sizes: TAM },
    { id: "polo-marinho-digital", cat: "polos", name: "Polo Marinho Estampa Digital", price: 139.9, imgs: [13, 51], sizes: TAM },
    { id: "polo-preto-atleta", cat: "polos", name: "Polo Preto Estampa Atleta", price: 139.9, imgs: [33, 21], sizes: TAM },
    { id: "polo-classico-branco", cat: "polos", name: "Polo Clássico Branco", price: 119.9, imgs: [42], sizes: TAM },
    // ---- CAMISETAS ----
    { id: "camiseta-dragao-vermelho", cat: "camisetas", name: "Camiseta Dragão Vermelho", price: 99.9, imgs: [0, 44], sizes: TAM, tag: "Novo" },
    { id: "camiseta-preta-logo-coral", cat: "camisetas", name: "Camiseta Preta Logo Coral", price: 99.9, imgs: [4, 32], sizes: TAM },
    { id: "camiseta-grafite-turquesa", cat: "camisetas", name: "Camiseta Grafite Azul-Turquesa", price: 99.9, imgs: [5, 9, 28], sizes: TAM },
    { id: "camiseta-jacare-lateral", cat: "camisetas", name: "Camiseta Preta Jacaré Lateral", price: 109.9, imgs: [12, 22], sizes: TAM },
    { id: "camiseta-offwhite-grafica", cat: "camisetas", name: "Camiseta Off-White Gráfica", price: 109.9, imgs: [23, 6], sizes: TAM },
    { id: "camiseta-preta-fita-lateral", cat: "camisetas", name: "Camiseta Preta Fita Lateral", price: 109.9, imgs: [53, 8], sizes: TAM },
    { id: "camiseta-preta-linha-lateral", cat: "camisetas", name: "Camiseta Preta Linha Lateral", price: 109.9, imgs: [25, 18], sizes: TAM },
    { id: "camiseta-preta-minimal", cat: "camisetas", name: "Camiseta Preta Minimal", price: 99.9, imgs: [49, 16], sizes: TAM },
    { id: "camiseta-preta-faixa-central", cat: "camisetas", name: "Camiseta Preta Faixa Central", price: 109.9, imgs: [24], sizes: TAM },
    { id: "camiseta-script-vermelho", cat: "camisetas", name: "Camiseta Preta Script Vermelho", price: 99.9, imgs: [47, 26], sizes: TAM },
    { id: "camiseta-fita-italia", cat: "camisetas", name: "Camiseta Preta Fita Itália", price: 109.9, imgs: [27, 43], sizes: TAM },
    { id: "camiseta-swoosh-gigante", cat: "camisetas", name: "Camiseta Preta Swoosh Gigante", price: 99.9, imgs: [69, 37, 56], sizes: TAM, tag: "Mais pedido" },
    { id: "camiseta-ilustracao-pop", cat: "camisetas", name: "Camiseta Preta Ilustração Pop", price: 99.9, imgs: [65, 71, 57], sizes: TAM },
    { id: "camiseta-cinza-gelo", cat: "camisetas", name: "Camiseta Cinza Gelo Básica", price: 89.9, imgs: [68, 46, 55], sizes: TAM },
    { id: "camiseta-marinho-gola", cat: "camisetas", name: "Camiseta Marinho Gola Contraste", price: 99.9, imgs: [59], sizes: TAM },
    // ---- CONJUNTOS ----
    { id: "conjunto-preto-rosa", cat: "conjuntos", name: "Conjunto Preto Estampa Rosa", price: 189.9, imgs: [14, 39], sizes: TAM, tag: "Conjunto" },
    { id: "conjunto-preto-laranja", cat: "conjuntos", name: "Conjunto Preto Estampa Laranja", price: 189.9, imgs: [29, 34], sizes: TAM, tag: "Conjunto" },
    { id: "conjunto-preto-texturizado", cat: "conjuntos", name: "Conjunto Preto Texturizado", price: 189.9, imgs: [19], sizes: TAM, tag: "Conjunto" },
    { id: "conjunto-polo-bermuda", cat: "conjuntos", name: "Conjunto Preto Polo + Bermuda", price: 199.9, imgs: [60], sizes: TAM, tag: "Conjunto" },
    // ---- BONÉS ----
    { id: "bone-preto-aba-curva", cat: "bones", name: "Boné Preto Aba Curva", price: 79.9, imgs: [3], sizes: ["Único"] },
    { id: "bone-aba-curva-trio", cat: "bones", name: "Bonés Aba Curva Branco e Preto", price: 79.9, imgs: [30], sizes: ["Único"] },
    { id: "bone-monograma", cat: "bones", name: "Boné Monograma Bege e Preto", price: 89.9, imgs: [48], sizes: ["Único"] }
  ];

  var CATS = { polos: "Polo", camisetas: "Camiseta", conjuntos: "Conjunto", bones: "Boné" };

  // Frete por UF (valores de EXEMPLO; trocar por Melhor Envio/Correios depois)
  var FRETE_GRATIS_ACIMA = 299;
  var REGIOES = [
    { ufs: ["RS"], valor: 18.9, prazo: "2 a 5 dias úteis" },
    { ufs: ["SC", "PR"], valor: 24.9, prazo: "3 a 6 dias úteis" },
    { ufs: ["SP", "RJ", "MG", "ES"], valor: 29.9, prazo: "4 a 8 dias úteis" },
    { ufs: ["DF", "GO", "MT", "MS"], valor: 34.9, prazo: "5 a 9 dias úteis" },
    { ufs: ["BA", "SE", "AL", "PE", "PB", "RN", "CE", "PI", "MA", "TO", "PA", "AP", "AM", "RR", "RO", "AC"], valor: 39.9, prazo: "7 a 14 dias úteis" }
  ];
  function frete(uf, subtotal) {
    uf = String(uf || "").toUpperCase();
    for (var i = 0; i < REGIOES.length; i++) {
      if (REGIOES[i].ufs.indexOf(uf) > -1) {
        var gratis = subtotal >= FRETE_GRATIS_ACIMA;
        return { valor: gratis ? 0 : REGIOES[i].valor, prazo: REGIOES[i].prazo, gratis: gratis };
      }
    }
    return null;
  }

  var api = { PRODUCTS: P, CATS: CATS, frete: frete, FRETE_GRATIS_ACIMA: FRETE_GRATIS_ACIMA, MAX_PARCELAS: 12 };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.LS_STORE = api;
})(typeof window !== "undefined" ? window : globalThis);
