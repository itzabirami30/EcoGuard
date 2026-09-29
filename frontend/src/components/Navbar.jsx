import React from "react";
import { Recycle, Bell } from "lucide-react";

function Navbar() {
  // Get logged-in user
  const storedUser = localStorage.getItem("ecoguardUser");

  let user = null;

  try {
    user = storedUser ? JSON.parse(storedUser) : null;
  } catch (error) {
    user = null;
  }

  const userName = user?.name || "Eco Citizen";
  const userRole = user?.role === "admin" ? "Admin" : "Citizen";

  // Get first letter for avatar
  const avatarLetter = userName.charAt(0).toUpperCase();

  return (
    <nav className="dashboard-navbar">

      <div className="dashboard-logo">
        <div className="dashboard-logo-icon">
          <Recycle size={21} />
        </div>

        <span>EcoGuard</span>
      </div>

      <div className="navbar-right">

        <button className="notification-btn">
          <Bell size={20} />
          <span className="notification-dot"></span>
        </button>

        <div className="user-profile">

          <div className="user-avatar">
            {avatarLetter}
          </div>

          <div className="user-info">
            <strong>{userName}</strong>
            <span>{userRole}</span>
          </div>

        </div>

      </div>

    </nav>
  );
}

export default Navbar;