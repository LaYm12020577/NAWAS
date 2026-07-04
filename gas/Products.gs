function syncProducts() {
  const shopId = CONFIG.SHOP_ID;
  const endpoint = '/seller-openapi/v1/product/shop/' + shopId + '?size=100&page=0';
  const data = uzumRequest(endpoint);

  if (data && data.payload && data.payload.products) {
    const products = data.payload.products;
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(SHEETS.PRODUCTS);

    sheet.clearContents();
    sheet.appendRow(['ID', 'Title', 'SKU', 'Price', 'Leftover']);

    products.forEach(product => {
      product.skuList.forEach(sku => {
        sheet.appendRow([
          product.id,
          product.title,
          sku.id,
          sku.price,
          sku.availableAmount
        ]);
      });
    });
  }
}
