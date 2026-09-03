// components/PrivateRoute.jsx
// -----------------------------------------------------------------------
// Wraps pages that require login (e.g. "Report an item"). If nobody is
// logged in, it redirects to the login page instead of showing the page.
// -----------------------------------------------------------------------

import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function PrivateRoute({ children }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
