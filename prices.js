/* Preços da vitrine.
   Não invente valores. Sem entrada em LS_PRICES, o card usa LS_PRICE_PLACEHOLDER
   (texto, sem número). Quando houver preço real:
     "id-da-peca": { preco: 189.9, precoAntigo: 239.9, parcelas: 12 }
   precoAntigo maior que preco mostra o riscado e o % OFF.
   parcelas > 1 mostra "Nx de R$ …". */
window.LS_PRICE_PLACEHOLDER = {
  placeholder: true,
  label: "Preço a confirmar",
  parcelasLabel: "Parcelamento a confirmar"
};
window.LS_PRICES = {
};
