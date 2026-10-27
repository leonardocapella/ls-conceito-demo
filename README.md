# LS Conceito: vitrine

Site estático (HTML/CSS/JS). A vitrine lista as peças e a compra segue pelo WhatsApp, já com o nome do produto e o tamanho escolhido.

## Ordem da home
Barra de anúncio rotativa → header → hero com as artes → categorias → Nossos lançamentos → banners de coleção → Instagram → marcas (16 logos) → catálogo com busca e filtros → dúvidas/WhatsApp → avaliações → grupo de novidades e newsletter → rodapé com os selos. Fundo preto e grafite em todo o site (pedido do dono, 27/10).

## Configurar (config.js)
- `whatsapp`: número da loja (DDI+DDD+número)
- `avisos`: mensagens da barra do topo (uma por vez)
- `banners`: artes do hero (`img/banners/<nome>-720|1100|1774.webp`)
- `lancamentos`: ids que aparecem em "Nossos lançamentos"
- `cupom`, `parcelasMax`: LSOFF10 e 12x, iguais aos da Nuvemshop
- `grupoNovidades`: link do grupo de WhatsApp (pendente; vazio mostra aviso)
- `depoimentos`: só avaliações reais; vazio mostra o espaço reservado
- `videoInstitucional`: vídeo fixo com botão de fechar (fase 2)
- `ga4`, `metaPixel`, `gtm`: IDs de rastreamento (opcional)
- `loja`: endereço na Nuvemshop, reservado para quando o carrinho online existir

## Produtos (products.js)
Cada peça tem nome, categoria, marca e fotos (`img/produtos/pN-400.webp` e `pN-800.webp`). `BRAND_LOGOS` lista as 16 marcas da faixa de logos (`img/marcas/<slug>.webp`), em ordem alfabética.

Tamanhos: se a peça não tiver `sizes`, entra a grade placeholder (`P M G GG`; bonés `Único`), marcada com `sizesPlaceholder`. Não é medida conferida peça a peça.

## Preços (prices.js)
Sem entrada em `LS_PRICES`, o card mostra o placeholder "Preço a confirmar" e não inventa valor. Com `preco`, `precoAntigo` e `parcelas` o card mostra o riscado, o % OFF e a linha de parcelas.

## Publicar
Site estático. O GitHub Pages publica a branch `main`.

## Carrinho de demonstração
"Adicionar ao carrinho" exige o tamanho, abre a gaveta e guarda id, tamanho e quantidade em `localStorage` (`ls-conceito-cart-v1`). "Finalizar compra" só avisa que o checkout roda na loja Nuvemshop: não há formulário de pagamento nem coleta de cartão. "Comprar pelo WhatsApp" segue como opção secundária.

## Banners (config.js)
`banners` define os slides do hero: `img` (prefixo da arte), `href` e `alt` com o texto da arte. As artes originais (1774×887) foram convertidas para WebP em três larguras.
