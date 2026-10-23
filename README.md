# LS Conceito: vitrine

Site estático (HTML/CSS/JS). A vitrine lista as peças e a compra segue pelo WhatsApp, já com o nome do produto e o tamanho escolhido.

## Configurar (config.js)
- `whatsapp`: número da loja (DDI+DDD+número)
- `avisos`: textos da faixa do topo
- `lancamentos`: ids que aparecem na grade de lançamentos
- `ga4`, `metaPixel`, `gtm`: IDs de rastreamento (opcional)
- `loja`: endereço na Nuvemshop, reservado para quando o carrinho online existir

## Produtos (products.js)
Cada peça tem nome, categoria, marca e fotos. O card mostra `Marca – Nome`.

Tamanhos: se a peça não tiver `sizes`, entra a grade placeholder (`P M G GG`; bonés `Único`), marcada com `sizesPlaceholder`. Não é medida conferida peça a peça.

## Preços (prices.js)
Sem entrada em `LS_PRICES`, o card mostra o placeholder "Preço a confirmar" e não inventa valor. Com `preco`, `precoAntigo` e `parcelas` o card mostra o riscado, o % OFF e a linha de parcelas.

## Publicar
Site estático. O GitHub Pages publica a branch `main`.
