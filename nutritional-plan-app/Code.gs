/**
 * Serves the web app UI.
 * @return {HtmlService.HtmlOutput} The HTML output of the web app.
 */
function doGet() {
  return HtmlService.createHtmlOutputFromFile('Index')
      .setTitle('Plan Nutricional')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/**
 * Determines which plan (sheet) to use based on the week of the month.
 * Logic: Week 1: Plan1, Week 2: Plan2, Week 3: Plan1, Week 4: Plan2, etc.
 * @return {string} The name of the sheet to use.
 */
function getPlanSheetName() {
  const date = new Date();
  const weekOfMonth = Math.ceil(date.getDate() / 7);
  return (weekOfMonth % 2 !== 0) ? 'Plan1' : 'Plan2';
}

/**
 * Gets the name of the current day in Spanish.
 * @return {string} The name of the current day.
 */
function getCurrentDayName() {
  const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  const date = new Date();
  return days[date.getDay()];
}

/**
 * Fetches the nutritional plan for a specific sheet.
 * @param {string} sheetName The name of the sheet.
 * @return {Array<Array<string>>} The plan data.
 */
function getPlanData(sheetName) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(sheetName);
  if (!sheet) return null;
  return sheet.getDataRange().getValues();
}

/**
 * Gets the current day's nutritional plan.
 * @return {Object} An object containing the current day's plan.
 */
function getTodayPlan() {
  const sheetName = getPlanSheetName();
  const dayName = getCurrentDayName();
  const data = getPlanData(sheetName);

  if (!data) return { error: 'Sheet ' + sheetName + ' not found' };

  const headers = data[0];
  const dayPlan = data.find(row => row[0].toLowerCase() === dayName.toLowerCase());

  if (!dayPlan) return { error: 'Plan for ' + dayName + ' not found in ' + sheetName };

  const result = {
    day: dayName,
    sheet: sheetName,
    meals: {}
  };

  for (let i = 1; i < headers.length; i++) {
    result.meals[headers[i]] = dayPlan[i];
  }

  return result;
}

/**
 * Gets the plan for both weeks (Plan1 and Plan2).
 * @return {Object} An object containing plans for both weeks.
 */
function getTwoWeekPlan() {
  const plan1Data = getPlanData('Plan1');
  const plan2Data = getPlanData('Plan2');

  return {
    plan1: plan1Data,
    plan2: plan2Data
  };
}

/**
 * TEST FUNCTION: Use this to verify logic within the Apps Script editor.
 */
function testLogic() {
  const sheetName = getPlanSheetName();
  const dayName = getCurrentDayName();
  Logger.log('Current Sheet: ' + sheetName);
  Logger.log('Current Day: ' + dayName);

  // To test different dates, you can temporarily modify getPlanSheetName and getCurrentDayName
  // for example, use a mock date:
  // const mockDate = new Date(2023, 9, 10); // Oct 10, 2023
}
