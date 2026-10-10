# LS Conceito: vitrine

Site estático (HTML/CSS/JS + GSAP). A **compra acontece na loja online (Nuvemshop)**: carrinho,
pagamento, frete, estoque e rastreio ficam por lá.

## Configurar (config.js)
- `loja`: endereço da loja na Nuvemshop (ex.: `https://lsconceito.lojavirtualnuvem.com.br`)
- `whatsapp`: número da loja (DDI+DDD+número)
- `ga4`, `metaPixel`, `gtm`: IDs de rastreamento (opcional)

## Produtos (products.js)
Cada peça tem nome, categoria, fotos e `url` (link da página do produto na Nuvemshop).
Sem `url`, o botão "Comprar na loja" abre o endereço da loja de `config.js`.

## Publicar
É um site estático: qualquer hospedagem serve (GitHub Pages, Vercel, Netlify, hospedagem comum).
