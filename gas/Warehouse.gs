function syncWarehouse() {
  const shopId = CONFIG.SHOP_ID;
  const endpoint = '/seller-openapi/v3/fbs/sku/stocks';
  const data = uzumRequest(endpoint);

  if (data && data.payload) {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(SHEETS.WAREHOUSE);

    sheet.clearContents();
    sheet.appendRow(['SKU ID', 'Warehouse', 'Available', 'Reserved']);

    data.payload.forEach(item => {
      sheet.appendRow([
        item.skuId,
        item.warehouseTitle,
        item.available,
        item.reserved
      ]);
    });
  }
}
