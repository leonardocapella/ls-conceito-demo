// Configurações públicas do site
window.LS_CONFIG = {
  // Endereço da loja online na Nuvemshop, se passar a existir.
  loja: "",
  // Barra de promoções no topo (troca sozinha).
  avisos: [
    "Na primeira compra, use o cupom LSOFF10 e ganhe 10% OFF",
    "Frete grátis nas compras acima de R$ 500,00",
    "Envio para todo o Brasil, compre sem sair de casa"
  ],
  // Banners da home (troca sozinha). title aceita <em> para o trecho em itálico.
  // filter abre o catálogo já filtrado por categoria.
  banners: [
    { eyebrow: "Moda masculina · Viamão, RS", title: "Presença sem <em>excesso.</em>", text: "Polos, camisetas, conjuntos e bonés, com envio para todo o Brasil.", cta: "Ver lançamentos", href: "#lancamentos", img: "img/p66.jpg", alt: "Polo azul céu com faixa preta" },
    { eyebrow: "Primeira compra", title: "10% OFF com o cupom <em>LSOFF10.</em>", text: "Use o cupom na primeira compra e vista a LS Conceito.", cta: "Ver camisetas", href: "#catalogo", filter: "camisetas", img: "img/p44.jpg", alt: "Camiseta Dragão Vermelho" },
    { eyebrow: "Envio para todo o Brasil", title: "Frete grátis acima de <em>R$ 500.</em>", text: "Monte o look completo e receba em casa.", cta: "Ver conjuntos", href: "#catalogo", filter: "conjuntos", img: "img/p29.jpg", alt: "Conjunto masculino" }
  ],
  // Peças de "Lançamentos" (ids de products.js, na ordem em que aparecem).
  lancamentos: [
    "polo-bloco-azul-gelo",
    "camiseta-dragao-vermelho",
    "polo-azul-ceu-faixa-preta",
    "camiseta-swoosh-gigante",
    "conjunto-preto-laranja",
    "polo-marinho-tricolor",
    "polo-verde-monograma",
    "camiseta-preta-logo-coral"
  ],
  // Instagram da loja (sem @).
  instagram: "ls_conceit0",
  // WhatsApp da loja: só números, com DDI+DDD.
  whatsapp: "555196717632",
  // IDs de rastreamento. Deixe vazio para desativar.
  ga4: "",
  metaPixel: "",
  gtm: ""
};
