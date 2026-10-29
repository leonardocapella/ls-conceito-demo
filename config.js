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
  // grupo: true faz o slide abrir o link do grupo de novidades (ou o aviso, enquanto o link não chega).
  banners: [
    { img: "frete-gratis", href: "#lancamentos", alt: "Frete grátis acima de R$ 500,00. Envio para todo o Brasil. Compre agora." },
    { img: "cupom-10off", href: "#catalogo", alt: "Na primeira compra, 10% OFF. Use o cupom LSOFF10." },
    { img: "instagram", href: "https://www.instagram.com/ls_conceit0/", externo: true, alt: "Siga nossa loja no Instagram: @ls_conceit0. Seguir no Instagram." },
    { img: "grupo-novidades", href: "#", grupo: true, alt: "Entre no grupo de novidades da LS Conceito no WhatsApp. Entrar no grupo." }
  ],
  // "Novos lançamentos": 4 peças (ids de products.js, na ordem em que aparecem).
  lancamentos: [
    "polo-bloco-azul-gelo",
    "camiseta-dragao-vermelho",
    "conjunto-preto-laranja",
    "camiseta-swoosh-gigante"
  ],
  // Faixa "Confira nossa coleção de ...": categoria de products.js e título.
  // Quando houver bermudas cadastradas, troque para { cat: "bermudas", titulo: "Bermuda" }.
  colecao: { cat: "polos", titulo: "Polo" },
  // Imagem real do grupo de novidades para o mockup de celular.
  // PENDENTE (Lorenzo): print do grupo. Vazio: o mockup mostra um espaço marcado.
  grupoImagem: "",
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
  // Avaliações reais de clientes. Não invente: só entre com nome, cidade, texto e foto enviados pelo Lorenzo.
  // Formato: { nome: "Nome S.", cidade: "Viamão, RS", texto: "...", foto: "img/depoimentos/arquivo.webp" }
  // PENDENTE (Lorenzo). Vazio: a seção mostra 3 cartões marcados como "Exemplo" (sem nome nem texto inventado).
  depoimentos: [],
  // Vídeo institucional fixo (fase 2). Vazio: nada aparece.
  videoInstitucional: "",
  // IDs de rastreamento. Deixe vazio para desativar.
  ga4: "",
  metaPixel: "",
  gtm: ""
};
