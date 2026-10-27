// Configurações públicas do site
window.LS_CONFIG = {
  // Endereço da loja online na Nuvemshop, se passar a existir.
  loja: "",
  // Barra de anúncio do topo: mostra uma mensagem por vez e troca sozinha.
  avisos: [
    "Frete grátis acima de R$ 500,00 · Envio para todo o Brasil",
    "10% OFF na primeira compra com o cupom LSOFF10",
    "Compra segura · Parcele em até 12x no cartão"
  ],
  // Banners do topo (troca sozinha). Cada arte já traz o texto e o botão desenhados;
  // o slide inteiro é o link. alt repete o texto da arte para leitor de tela e SEO.
  // img: prefixo em img/banners/ (existem as larguras 720, 1100 e 1774).
  banners: [
    { img: "frete-gratis", href: "#lancamentos", alt: "Frete grátis acima de R$ 500,00. Envio para todo o Brasil. Compre agora." },
    { img: "cupom-10off", href: "#catalogo", alt: "Na primeira compra, 10% OFF. Use o cupom LSOFF10." }
  ],
  // Peças de "Nossos lançamentos" (ids de products.js, na ordem em que aparecem).
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
  // Cupom de primeira compra (o limite de um uso por cliente se configura na Nuvemshop).
  cupom: "LSOFF10",
  // Parcelamento máximo no cartão, igual ao configurado na Nuvemshop.
  parcelasMax: 12,
  // Instagram da loja (sem @).
  instagram: "ls_conceit0",
  // WhatsApp da loja: só números, com DDI+DDD.
  whatsapp: "555196717632",
  // Link do grupo de novidades no WhatsApp (https://chat.whatsapp.com/...).
  // PENDENTE: enquanto estiver vazio, o botão avisa que o link chega em breve.
  grupoNovidades: "",
  // Avaliações reais de clientes. Não invente: só entre com nome, cidade e texto enviados pela loja.
  // Formato: { nome: "Nome S.", cidade: "Viamão, RS", texto: "...", foto: "img/depoimentos/arquivo.webp" }
  // Vazio: a seção mostra o espaço reservado.
  depoimentos: [],
  // Vídeo institucional fixo (fase 2). Vazio: nada aparece.
  videoInstitucional: "",
  // IDs de rastreamento. Deixe vazio para desativar.
  ga4: "",
  metaPixel: "",
  gtm: ""
};
