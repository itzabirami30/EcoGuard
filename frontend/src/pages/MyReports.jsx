import { API_URL } from "../config";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FileText,
  MapPin,
  AlertTriangle,
  Clock,
  CheckCircle,
  RefreshCw,
  ArrowLeft,
} from "lucide-react";

function MyReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================================
  // FETCH LOGGED-IN USER'S REPORTS
  // ==========================================
  const fetchReports = async () => {
    try {
      setLoading(true);
      setError("");

      // Get JWT token
      const token = localStorage.getItem(
        "ecoguardToken"
      );

      // Make sure user is logged in
      if (!token) {
        throw new Error(
          "Please login to view your reports."
        );
      }

      // Request only this user's reports
      const response = await fetch(API_URL + "/api/reports/my", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to load reports."
        );
      }

      setReports(data);

    } catch (err) {
      console.error(
        "Fetch reports error:",
        err
      );

      setError(
        err.message ||
          "Unable to load reports. Please make sure the backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // LOAD REPORTS WHEN PAGE OPENS
  // ==========================================
  useEffect(() => {
    fetchReports();
  }, []);

  // ==========================================
  // SEVERITY STYLE
  // ==========================================
  const getSeverityClass = (severity) => {
    if (severity === "High") {
      return "report-severity high";
    }

    if (severity === "Medium") {
      return "report-severity medium";
    }

    return "report-severity low";
  };

  // ==========================================
  // STATUS STYLE
  // ==========================================
  const getStatusClass = (status) => {
    if (status === "Resolved") {
      return "report-status resolved";
    }

    if (status === "In Progress") {
      return "report-status progress";
    }

    return "report-status pending";
  };

  // ==========================================
  // FORMAT DATE
  // ==========================================
  const formatDate = (date) => {
    if (!date) {
      return "Unknown date";
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

  return (
    <div className="my-reports-page">

      {/* =====================================
          HEADER
      ====================================== */}

      <div className="my-reports-header">

        <div>

          <div className="page-label">
            COMMUNITY ACTIVITY
          </div>

          <h1>My Reports</h1>

          <p>
            Track the waste and sanitation
            issues you have reported.
          </p>

        </div>

        <div className="my-reports-header-actions">

          {/* Refresh */}
          <button
            className="refresh-button"
            onClick={fetchReports}
            disabled={loading}
          >
            <RefreshCw size={16} />

            {loading
              ? "Loading..."
              : "Refresh"}
          </button>

          {/* Dashboard */}
          <Link
            to="/dashboard"
            className="back-dashboard"
          >
            <ArrowLeft size={16} />
            Dashboard
          </Link>

        </div>

      </div>

      {/* =====================================
          SUMMARY CARDS
      ====================================== */}

      <div className="reports-summary">

        {/* Total */}
        <div className="report-summary-card">

          <div className="summary-icon">
            <FileText size={22} />
          </div>

          <div>

            <span>
              Total Reports
            </span>

            <strong>
              {reports.length}
            </strong>

          </div>

        </div>

        {/* Pending */}
        <div className="report-summary-card">

          <div className="summary-icon pending-icon">
            <Clock size={22} />
          </div>

          <div>

            <span>
              Pending
            </span>

            <strong>
              {
                reports.filter(
                  (report) =>
                    report.status ===
                    "Pending Review"
                ).length
              }
            </strong>

          </div>

        </div>

        {/* In Progress */}
        <div className="report-summary-card">

          <div className="summary-icon progress-icon">
            <AlertTriangle size={22} />
          </div>

          <div>

            <span>
              In Progress
            </span>

            <strong>
              {
                reports.filter(
                  (report) =>
                    report.status ===
                    "In Progress"
                ).length
              }
            </strong>

          </div>

        </div>

        {/* Resolved */}
        <div className="report-summary-card">

          <div className="summary-icon resolved-icon">
            <CheckCircle size={22} />
          </div>

          <div>

            <span>
              Resolved
            </span>

            <strong>
              {
                reports.filter(
                  (report) =>
                    report.status ===
                    "Resolved"
                ).length
              }
            </strong>

          </div>

        </div>

      </div>

      {/* =====================================
          LOADING
      ====================================== */}

      {loading && (
        <div className="reports-message">

          <div className="loading-spinner"></div>

          <p>
            Loading your reports...
          </p>

        </div>
      )}

      {/* =====================================
          ERROR
      ====================================== */}

      {!loading && error && (
        <div className="reports-error">

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
          EMPTY STATE
      ====================================== */}

      {!loading &&
        !error &&
        reports.length === 0 && (
          <div className="empty-reports">

            <div className="empty-reports-icon">
              <FileText size={38} />
            </div>

            <h2>
              No Reports Yet
            </h2>

            <p>
              You haven't reported any waste
              or sanitation issues yet.
            </p>

            <Link
              to="/report-waste"
              className="report-waste-button"
            >
              Report Waste
            </Link>

          </div>
        )}

      {/* =====================================
          REPORT LIST
      ====================================== */}

      {!loading &&
        !error &&
        reports.length > 0 && (
          <div className="reports-list">

            {reports.map((report) => (

              <div
                className="my-report-card"
                key={report._id}
              >

                {/* TOP SECTION */}
                <div className="my-report-top">

                  <div>

                    <span className="report-id">
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
                <div className="my-report-details">

                  {/* Location */}
                  <div className="report-detail">

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

                  {/* Severity */}
                  <div className="report-detail">

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

                  {/* Date */}
                  <div className="report-detail">

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
                <div className="report-description">

                  <span>
                    Description
                  </span>

                  <p>
                    {report.description}
                  </p>

                </div>

                {/* IMAGE */}
                {report.hasImage && (
                  <div className="evidence-badge">
                    📷 Evidence photo attached
                  </div>
                )}

              </div>

            ))}

          </div>
        )}

    </div>
  );
}

export default MyReports;