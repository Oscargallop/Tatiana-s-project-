# Nutritional Plan Google Apps Script App

This application allows users to view their nutritional plan based on the current day and week of the month.

## Google Sheet Structure

Create a Google Sheet with two tabs (sheets) named `Semana 1` and `Semana 2`.

Each sheet should have the following structure:

| Day | Meal 1 | Meal 2 | Meal 3 | Meal 4 | Meal 5 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| Lunes | ... | ... | ... | ... | ... |
| Martes | ... | ... | ... | ... | ... |
| Miércoles | ... | ... | ... | ... | ... |
| Jueves | ... | ... | ... | ... | ... |
| Viernes | ... | ... | ... | ... | ... |
| Sábado | ... | ... | ... | ... | ... |
| Domingo | ... | ... | ... | ... | ... |

## Logic

- **Week 1 of the month**: Uses `Semana 1`
- **Week 2 of the month**: Uses `Semana 2`
- **Week 3 of the month**: Uses `Semana 1`
- **Week 4 of the month**: Uses `Semana 2`
- **Week 5 of the month** (if applicable): Uses `Semana 1`

## Files

- `Code.gs`: Contains the server-side logic and handles requests.
- `Index.html`: The frontend of the application.
