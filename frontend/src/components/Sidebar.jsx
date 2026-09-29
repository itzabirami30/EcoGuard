import React from "react";
import {
  LayoutDashboard,
  ScanLine,
  FileWarning,
  ClipboardList,
  Truck,
  Sparkles,
  Award,
  Settings,
  LogOut,
} from "lucide-react";

function Sidebar() {
  const handleLogout = () => {
    localStorage.removeItem("ecoguardToken");
    localStorage.removeItem("ecoguardUser");

    window.location.href = "/login";
  };

  return (
    <aside className="sidebar">

      <div className="sidebar-menu">

        <p className="menu-title">
          MAIN MENU
        </p>

        <a href="/dashboard" className="sidebar-link active">
          <LayoutDashboard size={19} />
          Dashboard
        </a>

        <a href="/waste-detection" className="sidebar-link">
          <ScanLine size={19} />
          Waste Detection
        </a>

        <a href="/report-waste" className="sidebar-link">
          <FileWarning size={19} />
          Report Waste
        </a>

        <a href="/my-reports" className="sidebar-link">
          <ClipboardList size={19} />
          My Reports
        </a>

        <a href="/collection" className="sidebar-link">
          <Truck size={19} />
          Collection
        </a>

        <a href="/sanitation" className="sidebar-link">
          <Sparkles size={19} />
          Sanitization
        </a>

        <p className="menu-title second">
          ECO COMMUNITY
        </p>

        <a href="#" className="sidebar-link">
          <Award size={19} />
          Eco Rewards
        </a>

        <a href="#" className="sidebar-link">
          <Settings size={19} />
          Settings
        </a>

      </div>

      <div className="sidebar-bottom">

        <button
          className="logout-button"
          onClick={handleLogout}
        >
          <LogOut size={18} />
          Logout
        </button>

      </div>

    </aside>
  );
}

export default Sidebar;