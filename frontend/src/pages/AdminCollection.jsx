import { API_URL } from "../config";
import React, { useEffect, useState } from "react";
import {
  Truck,
  MapPin,
  Calendar,
  Clock,
  Package,
  CheckCircle,
  RefreshCw,
  User,
} from "lucide-react";

function AdminCollection() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchRequests = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("ecoguardToken");

      if (!token) {
        throw new Error("Please login as an admin.");
      }

      const response = await fetch(API_URL + "/api/collection/admin", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to load collection requests."
        );
      }

      setRequests(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      const token = localStorage.getItem("ecoguardToken");

      const response = await fetch(API_URL + "/api/collection/admin", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            status,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to update status."
        );
      }

      setRequests((currentRequests) =>
        currentRequests.map((request) =>
          request._id === id
            ? {
                ...request,
                status: data.request.status,
              }
            : request
        )
      );
    } catch (err) {
      alert(err.message);
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "Pending":
        return "admin-collection-status pending";

      case "Accepted":
        return "admin-collection-status accepted";

      case "Collected":
        return "admin-collection-status collected";

      case "Cancelled":
        return "admin-collection-status cancelled";

      default:
        return "admin-collection-status";
    }
  };

  const pendingCount = requests.filter(
    (request) => request.status === "Pending"
  ).length;

  const acceptedCount = requests.filter(
    (request) => request.status === "Accepted"
  ).length;

  const collectedCount = requests.filter(
    (request) => request.status === "Collected"
  ).length;

  return (
    <div className="admin-collection-page">

      <div className="admin-collection-header">

        <div>
          <p className="admin-collection-eyebrow">
            ADMINISTRATION
          </p>

          <h1>Collection Management</h1>

          <p>
            Manage community waste collection requests.
          </p>
        </div>

        <button
          className="admin-collection-refresh"
          onClick={fetchRequests}
        >
          <RefreshCw size={18} />
          Refresh
        </button>

      </div>

      <div className="admin-collection-stats">

        <div className="admin-collection-stat">
          <div className="admin-collection-stat-icon pending-icon">
            <Clock size={22} />
          </div>

          <div>
            <span>Pending</span>
            <strong>{pendingCount}</strong>
          </div>
        </div>

        <div className="admin-collection-stat">
          <div className="admin-collection-stat-icon accepted-icon">
            <CheckCircle size={22} />
          </div>

          <div>
            <span>Accepted</span>
            <strong>{acceptedCount}</strong>
          </div>
        </div>

        <div className="admin-collection-stat">
          <div className="admin-collection-stat-icon collected-icon">
            <Truck size={22} />
          </div>

          <div>
            <span>Collected</span>
            <strong>{collectedCount}</strong>
          </div>
        </div>

      </div>

      {error && (
        <div className="admin-collection-error">
          {error}
        </div>
      )}

      {loading ? (
        <div className="admin-collection-loading">
          Loading collection requests...
        </div>
      ) : requests.length === 0 ? (
        <div className="admin-collection-empty">
          <Truck size={42} />
          <h2>No Collection Requests</h2>
          <p>
            New citizen collection requests will appear here.
          </p>
        </div>
      ) : (
        <div className="admin-collection-list">

          {requests.map((request) => (
            <div
              className="admin-collection-card"
              key={request._id}
            >

              <div className="admin-collection-card-top">

                <div>
                  <span className="admin-collection-id">
                    {request.requestId}
                  </span>

                  <h2>
                    {request.wasteType}
                  </h2>
                </div>

                <span className={getStatusClass(request.status)}>
                  {request.status}
                </span>

              </div>

              <div className="admin-collection-details">

                <div>
                  <Package size={17} />
                  <span>
                    <strong>Quantity</strong>
                    {request.quantity}
                  </span>
                </div>

                <div>
                  <MapPin size={17} />
                  <span>
                    <strong>Location</strong>
                    {request.location}
                  </span>
                </div>

                <div>
                  <Calendar size={17} />
                  <span>
                    <strong>Date</strong>
                    {request.preferredDate}
                  </span>
                </div>

                <div>
                  <Clock size={17} />
                  <span>
                    <strong>Time</strong>
                    {request.preferredTime}
                  </span>
                </div>

              </div>

              {request.userId && (
                <div className="admin-collection-user">
                  <User size={17} />

                  <span>
                    <strong>
                      Requested by:
                    </strong>{" "}
                    {request.userId.name || "Citizen"}
                    {" · "}
                    {request.userId.email || ""}
                  </span>
                </div>
              )}

              {request.description && (
                <div className="admin-collection-description">
                  <strong>Additional Details</strong>
                  <p>{request.description}</p>
                </div>
              )}

              <div className="admin-collection-actions">

                <span>
                  Update Status
                </span>

                <select
                  value={request.status}
                  onChange={(e) =>
                    updateStatus(
                      request._id,
                      e.target.value
                    )
                  }
                >
                  <option value="Pending">
                    Pending
                  </option>

                  <option value="Accepted">
                    Accepted
                  </option>

                  <option value="Collected">
                    Collected
                  </option>

                  <option value="Cancelled">
                    Cancelled
                  </option>
                </select>

              </div>

            </div>
          ))}

        </div>
      )}

    </div>
  );
}

export default AdminCollection;