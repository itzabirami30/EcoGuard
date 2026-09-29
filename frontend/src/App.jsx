import React from "react";
import "./App.css";
import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import WasteDetection from "./pages/WasteDetection";
import ReportWaste from "./pages/ReportWaste";
import MyReports from "./pages/MyReports";
import AdminDashboard from "./pages/AdminDashboard";
import Collection from "./pages/Collection";
import AdminCollection from "./pages/AdminCollection";
import MyCollections from "./pages/MyCollections";
import EcoRewards from "./pages/EcoRewards";
import Sanitization from "./pages/Sanitization";

function App() {

  return (
    <BrowserRouter>

      <Routes>

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

         <Route
          path="/waste-detection"
          element={<WasteDetection />}
        />

        <Route
          path="/report-waste"
          element={<ReportWaste />}
        />

        <Route
          path="/my-reports"
          element={<MyReports />}
        />

        <Route
          path="/my-reports"
          element={<MyReports />}
        />

        <Route
          path="/admin-dashboard"
          element={<AdminDashboard />}
        />

        <Route
          path="/collection"
          element={<Collection />}
        />

        <Route
          path="/admin-collection"
          element={<AdminCollection />}
        />

        <Route
          path="/my-collections"
          element={<MyCollections />}
        />

        <Route
          path="/eco-rewards"
          element={<EcoRewards />}
        />

        <Route
          path="/sanitation"
          element={<Sanitization />}
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;