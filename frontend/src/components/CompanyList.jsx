import { useMemo, useState } from "react";

function CompanyList({ companies, selectedSymbol, onSelect, loading, error }) {
  const [search, setSearch] = useState("");

  const filteredCompanies = useMemo(() => {
    const q = search.trim().toUpperCase();
    if (!q) {
      return companies;
    }
    return companies.filter((symbol) => symbol.toUpperCase().includes(q));
  }, [companies, search]);

  return (
    <aside className="sidebar">
      <h2>Companies</h2>
      <input
        type="text"
        placeholder="Search symbol"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        className="sidebar-search"
      />

      {loading && <p className="status">Loading companies...</p>}
      {error && <p className="status error">{error}</p>}

      <ul className="company-list">
        {filteredCompanies.map((symbol) => (
          <li key={symbol}>
            <button
              type="button"
              className={selectedSymbol === symbol ? "company-btn active" : "company-btn"}
              onClick={() => onSelect(symbol)}
            >
              {symbol}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}

export default CompanyList;
