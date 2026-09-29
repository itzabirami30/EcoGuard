import { API_URL } from "../config";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ShieldCheck,
  FileText,
  Clock,
  CheckCircle,
  AlertTriangle,
  MapPin,
  RefreshCw,
  ArrowLeft,
  Search,
  Truck,
} from "lucide-react";

function AdminDashboard() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [severityFilter, setSeverityFilter] = useState("All");

  // ==========================================
  // FETCH ALL REPORTS
  // ==========================================
  const fetchReports = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("ecoguardToken");

      if (!token) {
        throw new Error(
          "Please login before accessing the Admin Dashboard."
        );
      }

      const response = await fetch(API_URL + "/api/reports", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to load reports."
        );
      }

      setReports(data);
    } catch (err) {
      console.error("Fetch admin reports error:", err);

      setError(
        err.message ||
          "Unable to load reports. Please make sure the backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // LOAD REPORTS
  // ==========================================
  useEffect(() => {
    fetchReports();
  }, []);

  // ==========================================
  // UPDATE REPORT STATUS
  // ==========================================
  const updateStatus = async (reportId, newStatus) => {
    try {
      const token = localStorage.getItem("ecoguardToken");

      if (!token) {
        alert("Please login before updating reports.");
        return;
      }

      const response = await fetch(`${API_URL}/api/reports/${reportId}/status`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            status: newStatus,
          }),
          
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to update report status."
        );
      }

      setReports((currentReports) =>
        currentReports.map((report) =>
          report._id === reportId
            ? {
                ...report,
                status: newStatus,
              }
            : report
        )
      );
    } catch (err) {
      console.error("Update status error:", err);

      alert(
        err.message ||
          "Could not update the report status."
      );
    }
  };

  // ==========================================
  // DATE FORMATTING
  // ==========================================
  const formatDate = (date) => {
    if (!date) {
      return "Unknown";
    }

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  // ==========================================
  // STATUS CSS
  // ==========================================
  const getStatusClass = (status) => {
    if (status === "Resolved") {
      return "admin-status resolved";
    }

    if (status === "In Progress") {
      return "admin-status progress";
    }

    return "admin-status pending";
  };

  // ==========================================
  // SEVERITY CSS
  // ==========================================
  const getSeverityClass = (severity) => {
    if (severity === "High") {
      return "admin-severity high";
    }

    if (severity === "Medium") {
      return "admin-severity medium";
    }

    return "admin-severity low";
  };

  // ==========================================
  // FILTER REPORTS
  // ==========================================
  const filteredReports = reports.filter(
    (report) => {
      const searchText = search.toLowerCase();

      const matchesSearch =
        report.reportId
          ?.toLowerCase()
          .includes(searchText) ||
        report.wasteType
          ?.toLowerCase()
          .includes(searchText) ||
        report.location
          ?.toLowerCase()
          .includes(searchText) ||
        report.description
          ?.toLowerCase()
          .includes(searchText);

      const matchesStatus =
        statusFilter === "All" ||
        report.status === statusFilter;

      const matchesSeverity =
        severityFilter === "All" ||
        report.severity === severityFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesSeverity
      );
    }
  );

  // ==========================================
  // STATISTICS
  // ==========================================
  const totalReports = reports.length;

  const pendingReports = reports.filter(
    (report) =>
      report.status === "Pending Review"
  ).length;

  const progressReports = reports.filter(
    (report) =>
      report.status === "In Progress"
  ).length;

  const resolvedReports = reports.filter(
    (report) =>
      report.status === "Resolved"
  ).length;

  const highSeverityReports = reports.filter(
    (report) =>
      report.severity === "High"
  ).length;

  return (
    <div className="admin-page">

      {/* =====================================
          HEADER
      ====================================== */}

      <div className="admin-header">

        <div>

          <div className="admin-label">
            ADMINISTRATION
          </div>

          <h1>
            EcoGuard Admin Dashboard
          </h1>

          <p>
            Monitor, review and manage community
            waste reports.
          </p>

        </div>

        <div className="admin-header-actions">

          {/* COLLECTION MANAGEMENT */}

          <Link
            to="/admin-collection"
            className="admin-back-button"
          >
            <Truck size={16} />
            Manage Collections
          </Link>

          {/* REFRESH */}

          <button
            className="admin-refresh-button"
            onClick={fetchReports}
            disabled={loading}
          >
            <RefreshCw size={16} />

            {loading
              ? "Loading..."
              : "Refresh"}
          </button>

          {/* DASHBOARD */}

          <Link
            to="/dashboard"
            className="admin-back-button"
          >
            <ArrowLeft size={16} />
            Dashboard
          </Link>

        </div>

      </div>

      {/* =====================================
          ADMIN BADGE
      ====================================== */}

      <div className="admin-welcome">

        <div className="admin-shield">
          <ShieldCheck size={30} />
        </div>

        <div>

          <strong>
            Admin Control Center
          </strong>

          <p>
            Review reported sanitation issues
            and update their resolution status.
          </p>

        </div>

      </div>

      {/* =====================================
          ADMIN QUICK ACTION
      ====================================== */}

      <div
        style={{
          marginBottom: "24px",
          padding: "20px",
          borderRadius: "16px",
          background: "#f4faf7",
          border: "1px solid #dcebe4",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "20px",
          flexWrap: "wrap",
        }}
      >

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "14px",
          }}
        >

          <div
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "12px",
              background: "#e0f1ea",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#1e5a4b",
            }}
          >
            <Truck size={22} />
          </div>

          <div>

            <strong
              style={{
                display: "block",
                color: "#173c35",
                marginBottom: "4px",
              }}
            >
              Waste Collection Management
            </strong>

            <span
              style={{
                color: "#71857f",
                fontSize: "14px",
              }}
            >
              Review collection requests and
              update pickup status.
            </span>

          </div>

        </div>

        <Link
          to="/admin-collection"
          className="admin-back-button"
          style={{
            textDecoration: "none",
          }}
        >
          <Truck size={16} />
          Open Collection Manager
        </Link>

      </div>

      {/* =====================================
          STATISTICS
      ====================================== */}

      <div className="admin-stats">

        <div className="admin-stat-card">

          <div className="admin-stat-icon">
            <FileText size={23} />
          </div>

          <div>
            <span>Total Reports</span>
            <strong>
              {totalReports}
            </strong>
          </div>

        </div>

        <div className="admin-stat-card">

          <div className="admin-stat-icon pending">
            <Clock size={23} />
          </div>

          <div>
            <span>Pending Review</span>
            <strong>
              {pendingReports}
            </strong>
          </div>

        </div>

        <div className="admin-stat-card">

          <div className="admin-stat-icon progress">
            <AlertTriangle size={23} />
          </div>

          <div>
            <span>In Progress</span>
            <strong>
              {progressReports}
            </strong>
          </div>

        </div>

        <div className="admin-stat-card">

          <div className="admin-stat-icon resolved">
            <CheckCircle size={23} />
          </div>

          <div>
            <span>Resolved</span>
            <strong>
              {resolvedReports}
            </strong>
          </div>

        </div>

        <div className="admin-stat-card">

          <div className="admin-stat-icon danger">
            <AlertTriangle size={23} />
          </div>

          <div>
            <span>High Severity</span>
            <strong>
              {highSeverityReports}
            </strong>
          </div>

        </div>

      </div>

      {/* =====================================
          FILTERS
      ====================================== */}

      <div className="admin-filter-card">

        <div className="admin-search">

          <Search size={18} />

          <input
            type="text"
            placeholder="Search reports..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

        </div>

        <select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value)
          }
        >

          <option value="All">
            All Status
          </option>

          <option value="Pending Review">
            Pending Review
          </option>

          <option value="In Progress">
            In Progress
          </option>

          <option value="Resolved">
            Resolved
          </option>

        </select>

        <select
          value={severityFilter}
          onChange={(e) =>
            setSeverityFilter(e.target.value)
          }
        >

          <option value="All">
            All Severity
          </option>

          <option value="High">
            High
          </option>

          <option value="Medium">
            Medium
          </option>

          <option value="Low">
            Low
          </option>

        </select>

      </div>

      {/* =====================================
          LOADING
      ====================================== */}

      {loading && (
        <div className="admin-message">

          <div className="admin-spinner"></div>

          <p>
            Loading community reports...
          </p>

        </div>
      )}

      {/* =====================================
          ERROR
      ====================================== */}

      {!loading && error && (
        <div className="admin-error">

          <AlertTriangle size={22} />

          <div>

            <strong>
              Unable to load reports
            </strong>

            <p>
              {error}
            </p>

          </div>

          <button
            onClick={fetchReports}
          >
            Try Again
          </button>

        </div>
      )}

      {/* =====================================
          NO REPORTS
      ====================================== */}

      {!loading &&
        !error &&
        filteredReports.length === 0 && (
          <div className="admin-empty">

            <FileText size={40} />

            <h2>
              No reports found
            </h2>

            <p>
              There are no reports matching
              your current filters.
            </p>

          </div>
        )}

      {/* =====================================
          REPORTS
      ====================================== */}

      {!loading &&
        !error &&
        filteredReports.length > 0 && (

          <div className="admin-reports">

            {filteredReports.map(
              (report) => (

                <div
                  className="admin-report-card"
                  key={report._id}
                >

                  {/* TOP */}

                  <div className="admin-report-top">

                    <div>

                      <span className="admin-report-id">
                        {report.reportId}
                      </span>

                      <h2>
                        {report.wasteType}
                      </h2>

                    </div>

                    <span
                      className={getStatusClass(
                        report.status
                      )}
                    >
                      {report.status}
                    </span>

                  </div>

                  {/* DETAILS */}

                  <div className="admin-report-details">

                    <div className="admin-detail">

                      <MapPin size={17} />

                      <div>

                        <span>
                          Location
                        </span>

                        <strong>
                          {report.location}
                        </strong>

                      </div>

                    </div>

                    <div className="admin-detail">

                      <AlertTriangle size={17} />

                      <div>

                        <span>
                          Severity
                        </span>

                        <strong
                          className={getSeverityClass(
                            report.severity
                          )}
                        >
                          {report.severity}
                        </strong>

                      </div>

                    </div>

                    <div className="admin-detail">

                      <Clock size={17} />

                      <div>

                        <span>
                          Reported On
                        </span>

                        <strong>
                          {formatDate(
                            report.createdAt
                          )}
                        </strong>

                      </div>

                    </div>

                  </div>

                  {/* DESCRIPTION */}

                  <div className="admin-description">

                    <span>
                      Description
                    </span>

                    <p>
                      {report.description}
                    </p>

                  </div>

                  {/* STATUS CONTROL */}

                  <div className="admin-status-control">

                    <div>

                      <span>
                        Update Report Status
                      </span>

                      <small>
                        Change the current
                        resolution stage.
                      </small>

                    </div>

                    <select
                      value={
                        report.status ||
                        "Pending Review"
                      }
                      onChange={(e) =>
                        updateStatus(
                          report._id,
                          e.target.value
                        )
                      }
                    >

                      <option value="Pending Review">
                        Pending Review
                      </option>

                      <option value="In Progress">
                        In Progress
                      </option>

                      <option value="Resolved">
                        Resolved
                      </option>

                    </select>

                  </div>

                </div>

              )
            )}

          </div>

        )}

    </div>
  );
}

export default AdminDashboard;
