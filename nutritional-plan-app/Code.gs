/**
 * Global constant for meal titles mapping.
 */
const MEAL_TITLES = {
  'Meal 1': 'Desayuno',
  'Meal 2': 'Medias Nueves',
  'Meal 3': 'Almuerzo',
  'Meal 4': 'Onces',
  'Meal 5': 'Comida'
};

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
 * Logic: Week 1: Semana 1, Week 2: Semana 2, Week 3: Semana 1, Week 4: Semana 2, etc.
 * @return {string} The name of the sheet to use.
 */
function getPlanSheetName() {
  const date = new Date();
  const weekOfMonth = Math.ceil(date.getDate() / 7);
  return (weekOfMonth % 2 !== 0) ? 'Semana 1' : 'Semana 2';
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
    meals: []
  };

  // Iterate through MEAL_TITLES keys to ensure the correct order and translated titles
  Object.keys(MEAL_TITLES).forEach(mealKey => {
    const colIndex = headers.indexOf(mealKey);
    if (colIndex !== -1) {
      result.meals.push({
        title: MEAL_TITLES[mealKey],
        content: dayPlan[colIndex]
      });
    }
  });

  return result;
}

/**
 * Translates headers in the plan data.
 * @param {Array<Array<string>>} data The plan data.
 * @return {Array<Array<string>>} The data with translated headers.
 */
function translateHeaders(data) {
  if (!data || data.length === 0) return data;

  const headers = data[0];
  for (let i = 0; i < headers.length; i++) {
    if (MEAL_TITLES[headers[i]]) {
      headers[i] = MEAL_TITLES[headers[i]];
    }
  }
  return data;
}

/**
 * Gets the plan for both weeks (Semana 1 and Semana 2).
 * @return {Object} An object containing plans for both weeks.
 */
function getTwoWeekPlan() {
  const plan1Data = getPlanData('Semana 1');
  const plan2Data = getPlanData('Semana 2');

  return {
    plan1: translateHeaders(plan1Data),
    plan2: translateHeaders(plan2Data)
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
}
