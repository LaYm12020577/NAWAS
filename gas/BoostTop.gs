function syncBoostTop() {
  const sellerId = CONFIG.SELLER_ID;
  const endpoint = '/seller/advertising/management/boost-to-top/statistics?sellerId=' + sellerId;
  const data = uzumRequest(endpoint);

  if (data && data.payload) {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(SHEETS.BOOST_TOP);

    sheet.clearContents();
    sheet.appendRow(['SKU ID', 'Impressions', 'Clicks', 'Orders', 'Cost']);

    data.payload.forEach(item => {
      sheet.appendRow([
        item.skuId,
        item.impressions,
        item.clicks,
        item.orders,
        item.cost
      ]);
    });
  }
}
