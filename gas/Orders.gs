function syncOrders() {
  const shopId = CONFIG.SHOP_ID;
  const endpoint = '/seller-openapi/v1/finance/orders?shopId=' + shopId + '&size=100';
  const data = uzumRequest(endpoint);

  if (data && data.payload && data.payload.orders) {
    const orders = data.payload.orders;
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(SHEETS.ORDERS);

    // Simple overwrite for demonstration, in production use append/update logic
    sheet.clearContents();
    sheet.appendRow(['ID', 'Date', 'Status', 'Price', 'SKU', 'Title']);

    orders.forEach(order => {
      sheet.appendRow([
        order.id,
        order.dateCreated,
        order.status,
        order.orderPrice,
        order.skuId,
        order.productTitle
      ]);
    });
  }
}
