import React, { useEffect, useState } from "react";
import { API_URL } from "../config";
import {
  Sparkles,
  MapPin,
  AlertTriangle,
  Clock,
  CheckCircle,
  Send,
  RefreshCw,
} from "lucide-react";

function Sanitization() {
  const [form, setForm] = useState({
    areaType: "",
    location: "",
    issue: "",
    description: "",
    priority: "Medium",
  });

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingRequests, setLoadingRequests] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const token = localStorage.getItem("ecoguardToken");

  const loadRequests = async () => {
    try {
      setLoadingRequests(true);
      setError("");

      const response = await fetch(
        `${API_URL}/api/sanitation/my`,
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
      console.error("Load sanitation requests error:", err);
      setError(err.message);
    } finally {
      setLoadingRequests(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        `${API_URL}/api/sanitation`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(form),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to submit sanitation request."
        );
      }

      setMessage(
        `Sanitation request submitted successfully! Request ID: ${data.request.requestId}`
      );

      setForm({
        areaType: "",
        location: "",
        issue: "",
        description: "",
        priority: "Medium",
      });

      loadRequests();
    } catch (err) {
      console.error("Submit sanitation request error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
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
              Sanitization
            </h1>

            <p className="sanitation-subtitle">
              Report sanitation problems and help keep
              your community clean.
            </p>
          </div>
        </div>
      </div>

      {/* SUCCESS MESSAGE */}
      {message && (
        <div className="sanitation-message sanitation-success">
          <CheckCircle size={20} />
          <span>{message}</span>
        </div>
      )}

      {/* ERROR MESSAGE */}
      {error && (
        <div className="sanitation-message sanitation-error">
          <AlertTriangle size={20} />
          <span>{error}</span>
        </div>
      )}

      <div className="sanitation-grid">

        {/* =====================================
            REPORT FORM
        ===================================== */}
        <div className="sanitation-card">

          <h2 className="sanitation-card-title">
            Report Sanitation Issue
          </h2>

          <p className="sanitation-card-subtitle">
            Provide the details of the sanitation
            problem.
          </p>

          <form onSubmit={handleSubmit}>

            {/* AREA TYPE */}
            <label className="sanitation-label">
              Area Type
            </label>

            <select
              name="areaType"
              value={form.areaType}
              onChange={handleChange}
              className="sanitation-select"
              required
            >
              <option value="">
                Select area type
              </option>

              <option value="Public Toilet">
                Public Toilet
              </option>

              <option value="Street">
                Street
              </option>

              <option value="Drainage Area">
                Drainage Area
              </option>

              <option value="Community Area">
                Community Area
              </option>

              <option value="Collection Point">
                Collection Point
              </option>

              <option value="Other">
                Other
              </option>
            </select>

            {/* LOCATION */}
            <label className="sanitation-label">
              Location
            </label>

            <div style={{ position: "relative" }}>
              <MapPin
                size={18}
                style={{
                  position: "absolute",
                  left: "12px",
                  top: "12px",
                  color: "#71857f",
                }}
              />

              <input
                type="text"
                name="location"
                placeholder="Enter location"
                value={form.location}
                onChange={handleChange}
                className="sanitation-input"
                style={{ paddingLeft: "38px" }}
                required
              />
            </div>

            {/* ISSUE */}
            <label className="sanitation-label">
              Sanitation Issue
            </label>

            <input
              type="text"
              name="issue"
              placeholder="Example: Garbage accumulation"
              value={form.issue}
              onChange={handleChange}
              className="sanitation-input"
              required
            />

            {/* PRIORITY */}
            <label className="sanitation-label">
              Priority
            </label>

            <select
              name="priority"
              value={form.priority}
              onChange={handleChange}
              className="sanitation-select"
            >
              <option value="Low">
                Low
              </option>

              <option value="Medium">
                Medium
              </option>

              <option value="High">
                High
              </option>
            </select>

            {/* DESCRIPTION */}
            <label className="sanitation-label">
              Description
            </label>

            <textarea
              name="description"
              placeholder="Describe the problem in detail..."
              value={form.description}
              onChange={handleChange}
              rows="5"
              className="sanitation-textarea"
            />

            {/* SUBMIT */}
            <button
              type="submit"
              disabled={loading}
              className="sanitation-submit-button"
              style={{
                opacity: loading ? 0.7 : 1,
                cursor: loading
                  ? "not-allowed"
                  : "pointer",
              }}
            >
              <Send size={18} />

              {loading
                ? "Submitting..."
                : "Submit Sanitization Request"}
            </button>

          </form>
        </div>

        {/* =====================================
            MY REQUESTS
        ===================================== */}
        <div className="sanitation-card">

          <div className="sanitation-requests-header">

            <div>
              <h2 className="sanitation-card-title">
                My Requests
              </h2>

              <p className="sanitation-card-subtitle">
                Track your sanitation reports.
              </p>
            </div>

            <button
              type="button"
              onClick={loadRequests}
              className="sanitation-refresh-button"
              title="Refresh"
            >
              <RefreshCw size={18} />
            </button>

          </div>

          {loadingRequests ? (
            <div className="sanitation-empty">
              <p>Loading requests...</p>
            </div>
          ) : requests.length === 0 ? (
            <div className="sanitation-empty">

              <Sparkles
                size={40}
                color="#9aaca7"
              />

              <p className="sanitation-empty-title">
                No requests yet
              </p>

              <span className="sanitation-empty-text">
                Your sanitation requests will appear
                here after submission.
              </span>

            </div>
          ) : (
            <div className="sanitation-request-list">

              {requests.map((request) => (
                <div
                  key={request._id}
                  className="sanitation-request-card"
                >

                  <div className="sanitation-request-header">

                    <strong className="sanitation-request-id">
                      {request.requestId}
                    </strong>

                    <span className={getStatusClass(request.status)}>
                      {getStatusIcon(request.status)}
                      {request.status}
                    </span>

                  </div>

                  <h3 className="sanitation-issue">
                    {request.issue}
                  </h3>

                  <div className="sanitation-detail">
                    <MapPin size={15} />
                    <span>{request.location}</span>
                  </div>

                  <div className="sanitation-detail">
                    <AlertTriangle size={15} />
                    <span>
                      Priority: {request.priority}
                    </span>
                  </div>

                  <div className="sanitation-detail">
                    <Sparkles size={15} />
                    <span>{request.areaType}</span>
                  </div>

                  <small className="sanitation-date">
                    Submitted:{" "}
                    {new Date(
                      request.createdAt
                    ).toLocaleDateString()}
                  </small>

                </div>
              ))}

            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default Sanitization;