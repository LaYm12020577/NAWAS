function syncAnalytics() {
  const sellerId = CONFIG.SELLER_ID;

  // Daily Funnel
  const funnelData = uzumRequest('/analytics/cubejs/v1/load', 'POST', {
    "query": {
      "measures": ["AdvertisingDailyFunnel.impressions", "AdvertisingDailyFunnel.clicks", "AdvertisingDailyFunnel.orders"],
      "dimensions": ["AdvertisingDailyFunnel.date"],
      "filters": [{"member": "AdvertisingDailyFunnel.sellerId", "operator": "equals", "values": [sellerId.toString()]}]
    }
  });

  // CPO Funnel
  const cpoData = uzumRequest('/analytics/cubejs/v1/load', 'POST', {
    "query": {
      "measures": ["AdvertisingCpoFunnel.cpo", "AdvertisingCpoFunnel.roas", "AdvertisingCpoFunnel.crr"],
      "dimensions": ["AdvertisingCpoFunnel.date"],
      "filters": [{"member": "AdvertisingCpoFunnel.sellerId", "operator": "equals", "values": [sellerId.toString()]}]
    }
  });

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEETS.ANALYTICS);
  sheet.clearContents();
  sheet.appendRow(['Date', 'Impressions', 'Clicks', 'Orders', 'CPO', 'ROAS', 'CRR']);

  // Merge logic (simplified)
  if (funnelData && funnelData.data) {
    funnelData.data.forEach((row, i) => {
      const cpoRow = (cpoData && cpoData.data) ? cpoData.data[i] : {};
      sheet.appendRow([
        row['AdvertisingDailyFunnel.date'],
        row['AdvertisingDailyFunnel.impressions'],
        row['AdvertisingDailyFunnel.clicks'],
        row['AdvertisingDailyFunnel.orders'],
        cpoRow['AdvertisingCpoFunnel.cpo'] || 0,
        cpoRow['AdvertisingCpoFunnel.roas'] || 0,
        cpoRow['AdvertisingCpoFunnel.crr'] || 0
      ]);
    });
  }
}
