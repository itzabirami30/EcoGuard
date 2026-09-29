import React, { useEffect, useState } from "react";
import { API_URL } from "../config";
import {
  Sparkles,
  MapPin,
  AlertTriangle,
  Clock,
  CheckCircle,
  RefreshCw,
  User,
} from "lucide-react";

function AdminSanitization() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  const token = localStorage.getItem("ecoguardToken");

  const loadRequests = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_URL}/api/sanitation/admin`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to load sanitation requests."
        );
      }

      setRequests(data.requests || []);
    } catch (err) {
      console.error("Admin sanitation error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      setUpdatingId(id);
      setError("");

      const response = await fetch(
        `${API_URL}/api/sanitation/${id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to update status."
        );
      }

      setRequests((previousRequests) =>
        previousRequests.map((request) =>
          request._id === id
            ? { ...request, status }
            : request
        )
      );
    } catch (err) {
      console.error("Update status error:", err);
      setError(err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusClass = (status) => {
    if (status === "Resolved") {
      return "sanitation-status sanitation-status-resolved";
    }

    if (status === "Cleaning in Progress") {
      return "sanitation-status sanitation-status-progress";
    }

    if (status === "Assigned") {
      return "sanitation-status sanitation-status-assigned";
    }

    return "sanitation-status sanitation-status-reported";
  };

  const getStatusIcon = (status) => {
    if (status === "Resolved") {
      return <CheckCircle size={16} />;
    }

    if (status === "Cleaning in Progress") {
      return <Sparkles size={16} />;
    }

    return <Clock size={16} />;
  };

  return (
    <div className="sanitation-page">

      {/* HEADER */}
      <div className="sanitation-header">
        <div className="sanitation-title-row">
          <Sparkles size={30} color="#1e5a4b" />

          <div>
            <h1 className="sanitation-title">
              Sanitization Management
            </h1>

            <p className="sanitation-subtitle">
              Manage and track sanitation requests submitted
              by citizens.
            </p>
          </div>
        </div>
      </div>

      {/* ERROR */}
      {error && (
        <div className="sanitation-message sanitation-error">
          <AlertTriangle size={20} />
          <span>{error}</span>
        </div>
      )}

      {/* MAIN CARD */}
      <div className="sanitation-card admin-sanitation-card">

        <div className="sanitation-requests-header">

          <div>
            <h2 className="sanitation-card-title">
              All Sanitation Requests
            </h2>

            <p className="sanitation-card-subtitle">
              Review citizen reports and update their status.
            </p>
          </div>

          <button
            type="button"
            onClick={loadRequests}
            className="sanitation-refresh-button"
            title="Refresh requests"
          >
            <RefreshCw size={18} />
          </button>

        </div>

        {/* LOADING */}
        {loading ? (
          <div className="sanitation-empty">
            <RefreshCw size={35} />
            <p className="sanitation-empty-title">
              Loading requests...
            </p>
          </div>
        ) : requests.length === 0 ? (
          /* EMPTY */
          <div className="sanitation-empty">

            <Sparkles size={40} />

            <p className="sanitation-empty-title">
              No sanitation requests
            </p>

            <span className="sanitation-empty-text">
              Citizen sanitation reports will appear here.
            </span>

          </div>
        ) : (
          /* REQUEST LIST */
          <div className="sanitation-request-list">

            {requests.map((request) => (
              <div
                key={request._id}
                className="sanitation-request-card"
              >

                {/* TOP */}
                <div className="sanitation-request-header">

                  <strong className="sanitation-request-id">
                    {request.requestId}
                  </strong>

                  <span className={getStatusClass(request.status)}>
                    {getStatusIcon(request.status)}
                    {request.status}
                  </span>

                </div>

                {/* ISSUE */}
                <h3 className="sanitation-issue">
                  {request.issue}
                </h3>

                {/* LOCATION */}
                <div className="sanitation-detail">
                  <MapPin size={15} />
                  <span>
                    {request.location}
                  </span>
                </div>

                {/* AREA */}
                <div className="sanitation-detail">
                  <Sparkles size={15} />
                  <span>
                    Area: {request.areaType}
                  </span>
                </div>

                {/* PRIORITY */}
                <div className="sanitation-detail">
                  <AlertTriangle size={15} />
                  <span>
                    Priority: {request.priority}
                  </span>
                </div>

                {/* USER */}
                {request.userId && (
                  <div className="sanitation-detail">
                    <User size={15} />
                    <span>
                      Citizen:{" "}
                      {request.userId.name ||
                        request.userId.email ||
                        "Citizen"}
                    </span>
                  </div>
                )}

                {/* DESCRIPTION */}
                {request.description && (
                  <p className="sanitation-detail">
                    {request.description}
                  </p>
                )}

                {/* DATE */}
                <small className="sanitation-date">
                  Submitted:{" "}
                  {new Date(
                    request.createdAt
                  ).toLocaleString()}
                </small>

                {/* STATUS UPDATE */}
                <div className="admin-sanitation-status-section">

                  <label className="sanitation-label">
                    Update Status
                  </label>

                  <select
                    value={request.status}
                    onChange={(e) =>
                      updateStatus(
                        request._id,
                        e.target.value
                      )
                    }
                    className="sanitation-select"
                    disabled={
                      updatingId === request._id
                    }
                  >
                    <option value="Reported">
                      Reported
                    </option>

                    <option value="Assigned">
                      Assigned
                    </option>

                    <option value="Cleaning in Progress">
                      Cleaning in Progress
                    </option>

                    <option value="Resolved">
                      Resolved
                    </option>
                  </select>

                  {updatingId === request._id && (
                    <small className="sanitation-date">
                      Updating status...
                    </small>
                  )}

                </div>

              </div>
            ))}

          </div>
        )}

      </div>
    </div>
  );
}

export default AdminSanitization;