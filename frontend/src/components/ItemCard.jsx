// components/ItemCard.jsx
// -----------------------------------------------------------------------
// A reusable "card" for showing one lost/found item summary — used on
// the Browse page and the My Posts page.
// -----------------------------------------------------------------------

import { Link } from "react-router-dom";

export default function ItemCard({ item }) {
  const formattedDate = new Date(item.date).toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <Link to={`/items/${item._id}`} className="item-card" style={{ textDecoration: "none", color: "inherit" }}>
      <span className={`item-tag ${item.status}`}>
        {item.status === "lost" ? "LOST" : "FOUND"}
        {item.resolved ? " · RESOLVED" : ""}
      </span>

      <h3>{item.title}</h3>
      <p className="item-meta">
        {item.category} · {item.location}
      </p>
      <p className="description">
        {item.description.length > 100 ? item.description.slice(0, 100) + "…" : item.description}
      </p>
      <p className="item-meta">{formattedDate}</p>
    </Link>
  );
}
