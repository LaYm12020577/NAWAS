function updateDashboard() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const dashboard = ss.getSheetByName(SHEETS.DASHBOARD);
  const calcSheet = ss.getSheetByName(SHEETS.CALCULATIONS);

  if (!dashboard || !calcSheet) return;

  const calcData = calcSheet.getDataRange().getValues();

  dashboard.getRange("A1").setValue("UZUM SELLER ANALYTICS DASHBOARD").setFontWeight("bold").setFontSize(14);
  dashboard.getRange("A2").setValue("Last Updated: " + new Date());

  // Map calculation values to dashboard cells
  for (let i = 1; i < calcData.length; i++) {
    dashboard.getRange(4 + i, 1).setValue(calcData[i][0]);
    dashboard.getRange(4 + i, 2).setValue(calcData[i][1]);
  }
}
