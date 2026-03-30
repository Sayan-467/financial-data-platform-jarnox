import { useEffect, useMemo, useState } from "react";
import CompanyList from "./components/CompanyList";
import StockChart from "./components/StockChart";
import Compare from "./components/Compare";
import { fetchCompanies, fetchPrediction, fetchStockData, fetchSummary } from "./services/api";

function App() {
  const [companies, setCompanies] = useState([]);
  const [selectedSymbol, setSelectedSymbol] = useState("");
  const [stockData, setStockData] = useState([]);
  const [summary, setSummary] = useState(null);
  const [timeRange, setTimeRange] = useState(30);
  const [showPrediction, setShowPrediction] = useState(false);
  const [predictionData, setPredictionData] = useState([]);

  const [companiesLoading, setCompaniesLoading] = useState(false);
  const [stockLoading, setStockLoading] = useState(false);
  const [predictionLoading, setPredictionLoading] = useState(false);

  const [companiesError, setCompaniesError] = useState("");
  const [stockError, setStockError] = useState("");
  const [predictionError, setPredictionError] = useState("");

  useEffect(() => {
    async function loadCompanies() {
      try {
        setCompaniesLoading(true);
        setCompaniesError("");

        const data = await fetchCompanies();
        setCompanies(data);

        if (data.length) {
          setSelectedSymbol(data[0]);
        }
      } catch (error) {
        setCompaniesError(error.message || "Failed to load companies.");
      } finally {
        setCompaniesLoading(false);
      }
    }

    loadCompanies();
  }, []);

  useEffect(() => {
    if (!selectedSymbol) {
      return;
    }

    async function loadStockDetails() {
      try {
        setStockLoading(true);
        setStockError("");
        setShowPrediction(false);
        setPredictionData([]);
        setPredictionError("");

        const [data, summaryData] = await Promise.all([
          fetchStockData(selectedSymbol),
          fetchSummary(selectedSymbol)
        ]);

        const sorted = [...data].sort((a, b) => new Date(a.Date) - new Date(b.Date));
        setStockData(sorted);
        setSummary(summaryData);
      } catch (error) {
        setStockError(error.message || "Failed to load stock data.");
      } finally {
        setStockLoading(false);
      }
    }

    loadStockDetails();
  }, [selectedSymbol]);

  async function handlePredictionToggle() {
    if (!selectedSymbol) {
      return;
    }

    if (showPrediction) {
      setShowPrediction(false);
      return;
    }

    try {
      setPredictionLoading(true);
      setPredictionError("");

      if (!predictionData.length) {
        const result = await fetchPrediction(selectedSymbol, 7);
        const prices = Array.isArray(result?.predicted_prices)
          ? result.predicted_prices.map((value) => Number(value))
          : [];
        setPredictionData(prices);
      }

      setShowPrediction(true);
    } catch (error) {
      setPredictionError(error.message || "Failed to fetch prediction.");
    } finally {
      setPredictionLoading(false);
    }
  }

  const displayedData = useMemo(() => {
    return stockData.slice(-timeRange);
  }, [stockData, timeRange]);

  return (
    <div className="dashboard-root">
      <CompanyList
        companies={companies}
        selectedSymbol={selectedSymbol}
        onSelect={setSelectedSymbol}
        loading={companiesLoading}
        error={companiesError}
      />

      <main className="main-content">
        <header className="main-header card">
          <h1>Stock Data Dashboard</h1>
          <div className="header-controls">
            <p className="selected-symbol">Selected: {selectedSymbol || "-"}</p>
            <label className="range-control" htmlFor="rangeSelect">
              Time Range:
              <select
                id="rangeSelect"
                value={timeRange}
                onChange={(event) => setTimeRange(Number(event.target.value))}
              >
                <option value={30}>30 days</option>
                <option value={90}>90 days</option>
              </select>
            </label>
          </div>
        </header>

        {stockLoading && <p className="status">Loading stock data...</p>}
        {stockError && <p className="status error">{stockError}</p>}

        {!stockLoading && !stockError && (
          <>
            <section className="card">
              <div className="section-header-row">
                <h3>Price, Moving Average & Prediction</h3>
                <button
                  type="button"
                  className="prediction-btn"
                  onClick={handlePredictionToggle}
                  disabled={predictionLoading || !selectedSymbol}
                >
                  {predictionLoading
                    ? "Loading Prediction..."
                    : showPrediction
                      ? "Hide Prediction"
                      : "Show Prediction"}
                </button>
              </div>
              {predictionError && <p className="status error">{predictionError}</p>}
              <StockChart
                data={displayedData}
                symbol={selectedSymbol}
                predictedPrices={predictionData}
                showPrediction={showPrediction}
              />
            </section>

            <section className="card">
              <h3>Summary</h3>
              {summary ? (
                <div className="summary-grid">
                  <div>
                    <span>52-Week High</span>
                    <strong>{Number(summary.high_52w).toFixed(2)}</strong>
                  </div>
                  <div>
                    <span>52-Week Low</span>
                    <strong>{Number(summary.low_52w).toFixed(2)}</strong>
                  </div>
                  <div>
                    <span>Average Close</span>
                    <strong>{Number(summary.avg_close).toFixed(2)}</strong>
                  </div>
                </div>
              ) : (
                <p className="status">No summary available.</p>
              )}
            </section>

            <section className="card">
              <h3>Last {displayedData.length} Days</h3>
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Close</th>
                      <th>7-Day MA</th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayedData.map((row) => (
                      <tr key={`${row.Date}-${row.Close}`}>
                        <td>{new Date(row.Date).toLocaleDateString()}</td>
                        <td>{Number(row.Close).toFixed(2)}</td>
                        <td>{row.MA_7 == null ? "-" : Number(row.MA_7).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        )}

        <Compare />
      </main>
    </div>
  );
}

export default App;
