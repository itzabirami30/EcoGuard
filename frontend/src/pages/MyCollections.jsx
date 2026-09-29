import { API_URL } from "../config";
import React, { useEffect, useState } from "react";
import {
  Truck,
  MapPin,
  Calendar,
  Clock,
  Package,
  RefreshCw,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

function MyCollections() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchRequests = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("ecoguardToken");

      if (!token) {
        throw new Error("Please login to view your collections.");
      }

      const response = await fetch(API_URL + "/api/collection/my", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to load collections."
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

  const getStatusClass = (status) => {
    if (status === "Accepted") {
      return "my-collection-status accepted";
    }

    if (status === "Collected") {
      return "my-collection-status collected";
    }

    if (status === "Cancelled") {
      return "my-collection-status cancelled";
    }

    return "my-collection-status pending";
  };

  return (
    <div className="my-collection-page">

      <div className="my-collection-header">

        <div>
          <p className="my-collection-eyebrow">
            MY COLLECTIONS
          </p>

          <h1>My Collection Requests</h1>

          <p>
            Track your waste pickup requests and their status.
          </p>
        </div>

        <button
          className="my-collection-refresh"
          onClick={fetchRequests}
        >
          <RefreshCw size={18} />
          Refresh
        </button>

      </div>

      {error && (
        <div className="my-collection-error">
          <AlertCircle size={19} />
          {error}
        </div>
      )}

      {loading ? (
        <div className="my-collection-empty">
          Loading your collection requests...
        </div>
      ) : requests.length === 0 ? (
        <div className="my-collection-empty">
          <Truck size={45} />

          <h2>No Collection Requests</h2>

          <p>
            You haven't requested a waste collection yet.
          </p>
        </div>
      ) : (
        <div className="my-collection-list">

          {requests.map((request) => (
            <div
              className="my-collection-card"
              key={request._id}
            >

              <div className="my-collection-card-header">

                <div>
                  <span className="my-collection-id">
                    {request.requestId}
                  </span>

                  <h2>{request.wasteType}</h2>
                </div>

                <span
                  className={getStatusClass(
                    request.status
                  )}
                >
                  {request.status}
                </span>

              </div>

              <div className="my-collection-details">

                <div>
                  <Package size={18} />

                  <span>
                    <strong>Quantity</strong>
                    {request.quantity}
                  </span>
                </div>

                <div>
                  <MapPin size={18} />

                  <span>
                    <strong>Pickup Location</strong>
                    {request.location}
                  </span>
                </div>

                <div>
                  <Calendar size={18} />

                  <span>
                    <strong>Date</strong>
                    {request.preferredDate}
                  </span>
                </div>

                <div>
                  <Clock size={18} />

                  <span>
                    <strong>Time</strong>
                    {request.preferredTime}
                  </span>
                </div>

              </div>

              {request.description && (
                <div className="my-collection-description">
                  <strong>Additional Details</strong>
                  <p>{request.description}</p>
                </div>
              )}

              <div className="my-collection-status-message">

                {request.status === "Pending" && (
                  <>
                    <Clock size={18} />
                    <span>
                      Your request is waiting for admin
                      confirmation.
                    </span>
                  </>
                )}

                {request.status === "Accepted" && (
                  <>
                    <CheckCircle size={18} />
                    <span>
                      Your collection request has been
                      accepted. Pickup is scheduled.
                    </span>
                  </>
                )}

                {request.status === "Collected" && (
                  <>
                    <CheckCircle size={18} />
                    <span>
                      Your waste has been successfully
                      collected. Thank you for keeping
                      the city clean!
                    </span>
                  </>
                )}

                {request.status === "Cancelled" && (
                  <>
                    <AlertCircle size={18} />
                    <span>
                      This collection request has been
                      cancelled.
                    </span>
                  </>
                )}

              </div>

            </div>
          ))}

        </div>
      )}

    </div>
  );
}

export default MyCollections;