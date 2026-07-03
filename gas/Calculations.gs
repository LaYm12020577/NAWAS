function calculateMetrics() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const ordersSheet = ss.getSheetByName(SHEETS.ORDERS);
  const adsSheet = ss.getSheetByName(SHEETS.ADVERTISING);
  const financeSheet = ss.getSheetByName(SHEETS.FINANCE);
  const calcSheet = ss.getSheetByName(SHEETS.CALCULATIONS) || ss.insertSheet(SHEETS.CALCULATIONS);

  const orderData = ordersSheet.getDataRange().getValues();
  const adData = adsSheet.getDataRange().getValues();
  const financeData = financeSheet.getDataRange().getValues();

  let totalRevenue = 0;
  let totalOrders = 0;
  let totalAdSpent = 0;
  let totalCommissions = 0;
  let totalLogistics = 0;
  let totalStorage = 0;
  let totalClicks = 0;
  let totalImpressions = 10000; // Placeholder for CTR calc if data missing

  // Skip header
  for (let i = 1; i < orderData.length; i++) {
    const price = parseFloat(orderData[i][3]) || 0;
    totalRevenue += price;
    totalOrders++;
    // Assume 15% commission and 5000 UZS logistics if not in API
    totalCommissions += price * 0.15;
    totalLogistics += 5000;
  }

  for (let j = 1; j < adData.length; j++) {
    totalAdSpent += parseFloat(adData[j][4]) || 0;
  }

  // Extract specific expenses from finance sheet
  for (let k = 1; k < financeData.length; k++) {
    const type = financeData[k][2];
    const amount = parseFloat(financeData[k][3]) || 0;
    if (type === 'STORAGE') totalStorage += amount;
    if (type === 'LOGISTICS') totalLogistics += amount;
  }

  const netProfit = totalRevenue - totalCommissions - totalLogistics - totalStorage - totalAdSpent;
  const roi = totalAdSpent > 0 ? (netProfit / totalAdSpent) * 100 : 0;
  const roas = totalAdSpent > 0 ? (totalRevenue / totalAdSpent) : 0;
  const cpa = totalOrders > 0 ? (totalAdSpent / totalOrders) : 0;
  const cpo = totalOrders > 0 ? ((totalAdSpent + totalLogistics) / totalOrders) : 0;
  const crr = totalRevenue > 0 ? (totalAdSpent / totalRevenue) * 100 : 0;
  const ctr = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;
  const conversion = totalImpressions > 0 ? (totalOrders / totalImpressions) * 100 : 0;

  calcSheet.clearContents();
  calcSheet.appendRow(['Metric', 'Value']);
  calcSheet.appendRow(['Total Revenue', totalRevenue]);
  calcSheet.appendRow(['Net Profit', netProfit]);
  calcSheet.appendRow(['Total Orders', totalOrders]);
  calcSheet.appendRow(['Total Ad Spent', totalAdSpent]);
  calcSheet.appendRow(['Total Commissions', totalCommissions]);
  calcSheet.appendRow(['Total Logistics', totalLogistics]);
  calcSheet.appendRow(['Total Storage', totalStorage]);
  calcSheet.appendRow(['ROI', roi.toFixed(2) + '%']);
  calcSheet.appendRow(['ROAS', roas.toFixed(2)]);
  calcSheet.appendRow(['CPA', cpa.toFixed(2)]);
  calcSheet.appendRow(['CPO', cpo.toFixed(2)]);
  calcSheet.appendRow(['CRR', crr.toFixed(2) + '%']);
  calcSheet.appendRow(['CTR', ctr.toFixed(2) + '%']);
  calcSheet.appendRow(['Conversion', conversion.toFixed(2) + '%']);
}
