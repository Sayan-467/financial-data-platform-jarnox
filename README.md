# Financial Data Platform - Stock Dashboard

End-to-end stock analytics system with:
- Data ingestion from Yahoo Finance (`yfinance`)
- Data processing with `pandas`
- PostgreSQL-ready storage (SQLite fallback for local)
- FastAPI backend APIs
- React + Vite frontend dashboard with Chart.js visualizations
- Stock comparison and short-horizon price prediction

## Tech Stack

- [Python](https://www.python.org/)
- [FastAPI](https://fastapi.tiangolo.com/)
- [Pandas](https://pandas.pydata.org/), [NumPy](https://numpy.org/), [scikit-learn](https://scikit-learn.org/stable/)
- [SQLAlchemy](https://www.sqlalchemy.org/) + [PostgreSQL](https://www.postgresql.org/) (with SQLite fallback)
- [React](https://react.dev/) + [Vite](https://vitejs.dev/)
- [Chart.js](https://www.chartjs.org/) + [react-chartjs-2](https://react-chartjs-2.js.org/)

## 1) System Overview

### Backend (FastAPI)
- Serves stock APIs for companies, historical data, summary, comparison, and prediction.
- Uses `DATABASE_URL` from environment (Postgres recommended in deployment).
- CORS is enabled for local frontend origins (`http://localhost:5173`, `http://127.0.0.1:5173`).

### Data Pipeline
- Fetches data using `yfinance`
- Cleans/transforms data using `pandas`
- Stores enriched data into `stock_data` table in configured database

### Frontend (React + Vite)
- Sidebar company list
- Main panel with line chart and summary
- Compare two symbols
- Prediction toggle to overlay a dashed forecast line

## 2) Project Structure

```text
financial-data-platform-jarnox/
|-- app/
|   |-- db/
|   |   `-- database.py
|   |-- routes/
|   |   `-- stock_routes.py
|   |-- services/
|   |   |-- data_fetcher.py
|   |   |-- data_processor.py
|   |   |-- stock_service.py
|   |   `-- ml_service.py
|   `-- main.py
|-- data/
|-- scripts/
|   `-- seed_data.py
|-- frontend/
|   |-- src/
|   |   |-- components/
|   |   |   |-- CompanyList.jsx
|   |   |   |-- StockChart.jsx
|   |   |   `-- Compare.jsx
|   |   |-- services/
|   |   |   `-- api.js
|   |   |-- App.jsx
|   |   |-- main.jsx
|   |   `-- index.css
|   |-- package.json
|   `-- vite.config.js
|-- requirements.txt
|-- stocks.db
`-- README.md
```

## 3) Prerequisites

- Python 3.10+ (3.12 recommended)
- Node.js 18+ and npm
- Internet access (for `yfinance` data fetch)

## 4) Backend Setup

From project root:

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

Run FastAPI server:

```powershell
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

Check:
- API root: `http://127.0.0.1:8000/`
- Swagger docs: `http://127.0.0.1:8000/docs`

## 5) Frontend Setup

In a new terminal:

```powershell
Set-Location frontend
npm install
npm run dev
```

Open:
- `http://127.0.0.1:5173`

## 6) Data Seeding / Refresh Guide

Set your database URL (PowerShell examples):

```powershell
# Postgres (recommended)
$env:DATABASE_URL = "postgresql://USER:PASSWORD@HOST/DBNAME?sslmode=require"

# Optional local SQLite
# $env:DATABASE_URL = "sqlite:///./stocks.db"
```

Seed data from project root:

```powershell
python scripts/seed_data.py
```

## 7) API Endpoints

Base URL: `http://127.0.0.1:8000`

### GET `/companies`
Returns list of symbols.

Example response:

```json
["INFY.NS", "TCS.NS", "RELIANCE.NS", "HDFCBANK.NS"]
```

### GET `/data/{symbol}`
Returns last 30 rows with date, open, close, MA_7.

Example:

```text
/data/INFY.NS
```

### GET `/summary/{symbol}`
Returns:
- `high_52w`
- `low_52w`
- `avg_close`

### GET `/compare?symbol1=...&symbol2=...`
Returns:
- `symbol1_return`
- `symbol2_return`
- `better_performer`

### GET `/predict/{symbol}?days=7`
Returns short-horizon predicted prices.

Example response:

```json
{
  "predicted_prices": [1468.98, 1468.76, 1468.54, 1468.33, 1468.10, 1467.89, 1467.67]
}
```

## 8) Frontend Features

- Company list sidebar from `/companies`
- Historical table from `/data/{symbol}`
- Line chart with:
  - Close Price
  - 7-Day MA
  - Predicted Price (dashed, toggleable)
- Summary cards from `/summary/{symbol}`
- Compare panel from `/compare`
- Time range selector (30/90)
- Loading and error states

## 9) Prediction Logic Notes

Current prediction model in backend:
- Uses recency-weighted returns (short-term emphasis)
- Applies volatility damping
- Predicts recursively from latest close

This provides smoother, more realistic short-term behavior than simple global linear extrapolation.

## 10) Troubleshooting

### "Failed to fetch" in frontend
- Ensure backend is running on `127.0.0.1:8000`
- Ensure frontend runs on `localhost:5173` or `127.0.0.1:5173`
- Restart backend after backend code changes
- Verify CORS settings in backend app

### Empty company list or no chart data
- Ensure `stock_data` table exists and contains rows
- Re-run `python scripts/seed_data.py`

### Internal Server Error after deploying backend
- Confirm `DATABASE_URL` is set in deployment environment variables
- For Neon/Postgres, keep `sslmode=require` in URL
- Run seed command once in deployment shell: `python scripts/seed_data.py`

### Prediction line looks odd
- Prediction is short-horizon and trend-based, not a guaranteed market forecast
- Try different symbols or refresh the data for more recent movement

## 11) Recommended Development Workflow

1. Start backend server.
2. Start frontend dev server.
3. Open dashboard and verify API calls in browser network tab.
4. Re-seed data when needed.
5. Use `/docs` to test APIs quickly.

---

If you want, the next improvement can be adding a dedicated script file (for example, `scripts/seed_data.py`) so data refresh is a single command instead of copy/paste in REPL.
