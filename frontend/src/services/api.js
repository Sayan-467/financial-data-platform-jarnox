const API_BASE_URL = "http://127.0.0.1:8000";

async function request(path) {
  const response = await fetch(`${API_BASE_URL}${path}`);

  if (!response.ok) {
    let message = `Request failed with status ${response.status}`;
    try {
      const body = await response.json();
      if (body?.detail) {
        message = body.detail;
      }
    } catch {
      // Keep fallback message when response body is not JSON.
    }
    throw new Error(message);
  }

  return response.json();
}

export function fetchCompanies() {
  return request("/companies");
}

export function fetchStockData(symbol) {
  return request(`/data/${encodeURIComponent(symbol)}`);
}

export function fetchSummary(symbol) {
  return request(`/summary/${encodeURIComponent(symbol)}`);
}

export function compareStocks(symbol1, symbol2) {
  const query = new URLSearchParams({ symbol1, symbol2 }).toString();
  return request(`/compare?${query}`);
}

export function fetchPrediction(symbol, days = 7) {
  const query = new URLSearchParams({ days: String(days) }).toString();
  return request(`/predict/${encodeURIComponent(symbol)}?${query}`);
}
