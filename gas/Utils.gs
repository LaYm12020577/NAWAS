function formatCurrency(amount) {
  return new Intl.NumberFormat('uz-UZ', { style: 'currency', currency: 'UZS' }).format(amount);
}

function parseDate(dateStr) {
  return new Date(dateStr);
}

function getColumnIndexByName(sheet, name) {
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  return headers.indexOf(name) + 1;
}
