// pages/ReportItem.jsx
// -----------------------------------------------------------------------
// Form for creating a new "lost" or "found" post. This page is wrapped
// in <PrivateRoute> in App.jsx, so only logged-in users can reach it.
// -----------------------------------------------------------------------

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

const CATEGORIES = ["Electronics", "Documents", "Accessories", "Bags", "Clothing", "Keys", "Other"];

export default function ReportItem() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "Other",
    status: "lost",
    location: "",
    date: "",
    imageUrl: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data } = await api.post("/items", form);
      navigate(`/items/${data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="form-card">
      <h2>Report an item</h2>
      <p className="helper-text" style={{ marginTop: -8, marginBottom: 20 }}>
        Fill in as much detail as you can — it helps others recognize the item.
      </p>

      {error && <div className="form-error">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="status">This item was…</label>
          <select id="status" name="status" value={form.status} onChange={handleChange}>
            <option value="lost">Lost (I lost it)</option>
            <option value="found">Found (I found it)</option>
          </select>
        </div>

        <div className="field">
          <label htmlFor="title">Item title</label>
          <input
            id="title"
            name="title"
            type="text"
            required
            placeholder="e.g. Black Wildcraft backpack"
            value={form.title}
            onChange={handleChange}
          />
        </div>

        <div className="field">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            required
            placeholder="Color, brand, any identifying marks…"
            value={form.description}
            onChange={handleChange}
          />
        </div>

        <div className="field">
          <label htmlFor="category">Category</label>
          <select id="category" name="category" value={form.category} onChange={handleChange}>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label htmlFor="location">Location</label>
          <input
            id="location"
            name="location"
            type="text"
            required
            placeholder="e.g. Library, 2nd floor"
            value={form.location}
            onChange={handleChange}
          />
        </div>

        <div className="field">
          <label htmlFor="date">Date {form.status === "lost" ? "lost" : "found"}</label>
          <input id="date" name="date" type="date" required value={form.date} onChange={handleChange} />
        </div>

        <div className="field">
          <label htmlFor="imageUrl">Photo URL (optional)</label>
          <input
            id="imageUrl"
            name="imageUrl"
            type="url"
            placeholder="https://…"
            value={form.imageUrl}
            onChange={handleChange}
          />
        </div>

        <button type="submit" className="btn btn-primary" style={{ width: "100%" }} disabled={loading}>
          {loading ? "Posting…" : "Post item"}
        </button>
      </form>
    </div>
  );
}
