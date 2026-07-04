/**
 * Core API Request Handler
 */
function uzumRequest(endpoint, method = 'GET', payload = null) {
  const url = CONFIG.BASE_URL + endpoint;
  const options = {
    method: method,
    headers: {
      'Authorization': 'Bearer ' + CONFIG.BEARER_TOKEN,
      'Content-Type': 'application/json'
    },
    muteHttpExceptions: true
  };

  if (payload) {
    options.payload = JSON.stringify(payload);
  }

  const response = UrlFetchApp.fetch(url, options);
  const responseCode = response.getResponseCode();
  const content = response.getContentText();

  if (responseCode >= 200 && responseCode < 300) {
    return JSON.parse(content);
  } else {
    logToSheet('API Error: ' + endpoint + ' (' + responseCode + ') - ' + content);
    throw new Error('API Error: ' + responseCode + ' ' + content);
  }
}

/**
 * Synchronization Logic
 */
function syncAll() {
  logToSheet('Starting synchronization...');
  try {
    // 1. Fetch Primary Data
    syncOrders();
    syncProducts();
    syncFinance();

    // 2. Fetch Advertising & Warehouse
    syncAdvertising();
    syncBoostTop();
    syncWarehouse();

    // 3. Fetch Analytics
    syncAnalytics();

    // 4. Run Calculations
    calculateMetrics();

    // 5. Update UI
    updateDashboard();

    logToSheet('Synchronization complete.');
  } catch (e) {
    logToSheet('Sync Failed: ' + e.toString() + ' at ' + e.stack);
    sendTelegramNotification('🚨 <b>Sync Failed</b>\nError: ' + e.toString());
  }
}

function logToSheet(message) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEETS.LOGS);
  if (sheet) {
    sheet.appendRow([new Date(), message]);
  }
}
