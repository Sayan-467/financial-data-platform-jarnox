import { useState } from "react";
import { compareStocks } from "../services/api";

function Compare() {
  const [symbol1, setSymbol1] = useState("");
  const [symbol2, setSymbol2] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleCompare(event) {
    event.preventDefault();
    setError("");
    setResult(null);

    const left = symbol1.trim().toUpperCase();
    const right = symbol2.trim().toUpperCase();

    if (!left || !right) {
      setError("Please enter both stock symbols.");
      return;
    }

    try {
      setLoading(true);
      const data = await compareStocks(left, right);
      setResult({ ...data, symbol1: left, symbol2: right });
    } catch (requestError) {
      setError(requestError.message || "Unable to compare stocks.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="card compare-section">
      <h3>Compare Stocks</h3>
      <form className="compare-form" onSubmit={handleCompare}>
        <input
          type="text"
          placeholder="Symbol 1 (e.g. INFY.NS)"
          value={symbol1}
          onChange={(event) => setSymbol1(event.target.value)}
        />
        <input
          type="text"
          placeholder="Symbol 2 (e.g. TCS.NS)"
          value={symbol2}
          onChange={(event) => setSymbol2(event.target.value)}
        />
        <button type="submit" disabled={loading}>
          {loading ? "Comparing..." : "Compare"}
        </button>
      </form>

      {error && <p className="status error">{error}</p>}

      {result && (
        <div className="compare-result">
          <p>
            <strong>{result.symbol1} Return:</strong> {(result.symbol1_return * 100).toFixed(2)}%
          </p>
          <p>
            <strong>{result.symbol2} Return:</strong> {(result.symbol2_return * 100).toFixed(2)}%
          </p>
          <p>
            <strong>Better Performer:</strong> {result.better_performer}
          </p>
        </div>
      )}
    </section>
  );
}

export default Compare;
