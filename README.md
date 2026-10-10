# LS Conceito: vitrine

Site estático (HTML/CSS/JS + GSAP). A **compra acontece na loja online (Nuvemshop)**: carrinho,
pagamento, frete, estoque e rastreio ficam por lá.

## Configurar (config.js)
- `loja`: endereço da loja na Nuvemshop (ex.: `https://lsconceito.lojavirtualnuvem.com.br`)
- `whatsapp`: número da loja (DDI+DDD+número)
- `ga4`, `metaPixel`, `gtm`: IDs de rastreamento (opcional)

- `avisos`: textos da faixa do topo (edite conforme as promoções ativas na Nuvemshop)

## Produtos (products.js)
Cada peça tem nome, categoria e fotos. Para a compra funcionar de ponta a ponta:
- `variants`: ID da variação (tamanho) de cada peça na Nuvemshop, ex. `{ P: "123", M: "124" }`.
  O botão Comprar abre `loja/comprar/ID-1/`, que coloca o tamanho escolhido no carrinho da loja.
- `url`: página do produto (usado se não houver variação). Sem nada, abre o endereço da loja.

Promoções (5% na primeira compra, frete grátis acima de R$ 500) e o pagamento são configurados na Nuvemshop;
o site só divulga.

## Publicar
É um site estático: qualquer hospedagem serve (GitHub Pages, Vercel, Netlify, hospedagem comum).
