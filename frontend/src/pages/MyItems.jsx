// pages/MyItems.jsx
// -----------------------------------------------------------------------
// Shows only the posts created by the currently logged-in user, so they
// can track and manage what they've reported.
// -----------------------------------------------------------------------

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import ItemCard from "../components/ItemCard";

export default function MyItems() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchMyItems();
  }, []);

  async function fetchMyItems() {
    try {
      setLoading(true);
      const { data } = await api.get("/items/mine");
      setItems(data);
    } catch (err) {
      setError("Couldn't load your items.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container">
      <div className="page-header">
        <div>
          <h1>My posts</h1>
          <p>Everything you've reported as lost or found.</p>
        </div>
        <Link to="/report" className="btn btn-primary">
          + Report a new item
        </Link>
      </div>

      {error && <p className="form-error" style={{ marginTop: 20 }}>{error}</p>}

      {loading ? (
        <p className="empty-state">Loading…</p>
      ) : items.length === 0 ? (
        <div className="empty-state">
          <h3>You haven't posted anything yet</h3>
          <p>
            <Link to="/report">Report a lost or found item</Link> to get started.
          </p>
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
