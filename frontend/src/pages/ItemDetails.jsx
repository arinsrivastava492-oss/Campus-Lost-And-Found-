// pages/ItemDetails.jsx
// -----------------------------------------------------------------------
// Shows the full details of a single item. If the logged-in user is the
// one who posted it, they also get "Mark as resolved" and "Delete"
// buttons.
// -----------------------------------------------------------------------

import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function ItemDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchItem();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function fetchItem() {
    try {
      setLoading(true);
      const { data } = await api.get(`/items/${id}`);
      setItem(data);
    } catch (err) {
      setError("This item couldn't be found. It may have been removed.");
    } finally {
      setLoading(false);
    }
  }

  const isOwner = user && item && item.postedBy?._id === user._id;

  async function handleToggleResolved() {
    setActionLoading(true);
    try {
      const { data } = await api.put(`/items/${id}`, { resolved: !item.resolved });
      setItem(data);
    } catch (err) {
      setError("Couldn't update the item. Please try again.");
    } finally {
      setActionLoading(false);
    }
  }

  async function handleDelete() {
    if (!window.confirm("Delete this post? This can't be undone.")) return;

    setActionLoading(true);
    try {
      await api.delete(`/items/${id}`);
      navigate("/");
    } catch (err) {
      setError("Couldn't delete the item. Please try again.");
      setActionLoading(false);
    }
  }

  if (loading) return <p className="empty-state">Loading…</p>;
  if (error && !item) return <p className="empty-state">{error}</p>;
  if (!item) return null;

  const formattedDate = new Date(item.date).toLocaleDateString(undefined, {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="details-card">
      <Link to="/">&larr; Back to all items</Link>

      {item.resolved && <div className="resolved-banner" style={{ marginTop: 16 }}>✅ This item has been marked as resolved.</div>}

      <span className={`item-tag ${item.status}`} style={{ marginTop: 16 }}>
        {item.status === "lost" ? "LOST" : "FOUND"}
      </span>

      <h1>{item.title}</h1>
      <p className="item-meta">
        {item.category} · {item.location} · {formattedDate}
      </p>

      {item.imageUrl && (
        <img
          src={item.imageUrl}
          alt={item.title}
          style={{ width: "100%", borderRadius: 6, margin: "16px 0" }}
        />
      )}

      <p>{item.description}</p>

      <p className="item-meta" style={{ marginTop: 16 }}>
        Posted by {item.postedBy?.name || "a user"}
        {item.postedBy?.email ? ` — ${item.postedBy.email}` : ""}
      </p>

      {error && <div className="form-error" style={{ marginTop: 16 }}>{error}</div>}

      {isOwner && (
        <div className="details-actions">
          <button className="btn btn-outline" onClick={handleToggleResolved} disabled={actionLoading}>
            {item.resolved ? "Mark as unresolved" : "Mark as resolved"}
          </button>
          <button className="btn btn-danger" onClick={handleDelete} disabled={actionLoading}>
            Delete post
          </button>
        </div>
      )}
    </div>
  );
}
