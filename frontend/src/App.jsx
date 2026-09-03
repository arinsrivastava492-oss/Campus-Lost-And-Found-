// App.jsx
// -----------------------------------------------------------------------
// Defines all the pages ("routes") in the app and which URL shows which
// page. This is the map of the whole frontend.
// -----------------------------------------------------------------------

import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import PrivateRoute from "./components/PrivateRoute";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ReportItem from "./pages/ReportItem";
import ItemDetails from "./pages/ItemDetails";
import MyItems from "./pages/MyItems";

export default function App() {
  return (
    <>
      <Navbar />

      <Routes>
        {/* Public pages — anyone can view these */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/items/:id" element={<ItemDetails />} />

        {/* Private pages — must be logged in, enforced by <PrivateRoute> */}
        <Route
          path="/report"
          element={
            <PrivateRoute>
              <ReportItem />
            </PrivateRoute>
          }
        />
        <Route
          path="/my-items"
          element={
            <PrivateRoute>
              <MyItems />
            </PrivateRoute>
          }
        />

        {/* Fallback for any unknown URL */}
        <Route path="*" element={<div className="container empty-state"><h2>Page not found</h2></div>} />
      </Routes>
    </>
  );
}
