function syncAdvertising() {
  const sellerId = CONFIG.SELLER_ID;
  const endpoint = '/seller/advertising/management/ad-campaign?sellerId=' + sellerId;
  const data = uzumRequest(endpoint);

  if (data) {
    const campaigns = data.campaigns || [];
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(SHEETS.ADVERTISING);

    sheet.clearContents();
    sheet.appendRow(['ID', 'Name', 'Status', 'Budget', 'Spent']);

    campaigns.forEach(c => {
      sheet.appendRow([
        c.id,
        c.name,
        c.status,
        c.budget,
        c.spent || 0
      ]);
    });
  }
}
