// pages/Home.jsx
// -----------------------------------------------------------------------
// The main "Browse" page — shows every lost/found post, with a search
// box and status/category filters. This page is public (no login needed).
// -----------------------------------------------------------------------

import { useEffect, useState } from "react";
import api from "../api/axios";
import ItemCard from "../components/ItemCard";

const CATEGORIES = ["Electronics", "Documents", "Accessories", "Bags", "Clothing", "Keys", "Other"];

export default function Home() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filter state
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [category, setCategory] = useState("");

  // Re-fetch items whenever a filter changes.
  // (A small debounce on `search` avoids firing a request on every keystroke.)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchItems();
    }, 300);
    return () => clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, status, category]);

  async function fetchItems() {
    try {
      setLoading(true);
      setError("");

      const params = {};
      if (search) params.search = search;
      if (status) params.status = status;
      if (category) params.category = category;

      const { data } = await api.get("/items", { params });
      setItems(data);
    } catch (err) {
      setError("Couldn't load items. Is the backend server running?");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container">
      <div className="page-header">
        <div>
          <h1>What's been lost or found on campus</h1>
          <p>Browse recent posts, or search for something specific.</p>
        </div>
      </div>

      <div className="filter-bar">
        <input
          type="text"
          placeholder="Search by name, keyword, or location…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All statuses</option>
          <option value="lost">Lost</option>
          <option value="found">Found</option>
        </select>

        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">All categories</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {error && <p className="form-error" style={{ marginTop: 20 }}>{error}</p>}

      {loading ? (
        <p className="empty-state">Loading items…</p>
      ) : items.length === 0 ? (
        <div className="empty-state">
          <h3>No items match your search</h3>
          <p>Try clearing the filters, or check back later.</p>
        </div>
      ) : (
        <div className="item-grid">
          {items.map((item) => (
            <ItemCard key={item._id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
