function syncFinance() {
  const shopId = CONFIG.SHOP_ID;
  const endpoint = '/seller-openapi/v1/finance/expenses?shopId=' + shopId;
  const data = uzumRequest(endpoint);

  if (data && data.payload) {
    const expenses = data.payload.expenses || [];
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(SHEETS.FINANCE);

    sheet.clearContents();
    sheet.appendRow(['ID', 'Date', 'Type', 'Amount', 'Description']);

    expenses.forEach(exp => {
      sheet.appendRow([
        exp.id,
        exp.dateCreated,
        exp.type,
        exp.amount,
        exp.description
      ]);
    });
  }
}
