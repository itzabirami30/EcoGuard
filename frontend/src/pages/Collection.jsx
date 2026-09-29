import { API_URL } from "../config";
import React, { useState } from "react";
import {
  Truck,
  MapPin,
  Calendar,
  Clock,
  Package,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

function Collection() {
  const [formData, setFormData] = useState({
    wasteType: "",
    quantity: "",
    location: "",
    preferredDate: "",
    preferredTime: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setSuccess("");
    setError("");

    try {
      const token = localStorage.getItem("ecoguardToken");

      if (!token) {
        throw new Error("Please login before requesting collection.");
      }

      const response = await fetch(API_URL + "/api/collection", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to submit collection request."
        );
      }

      setSuccess(
        `Collection request submitted successfully! Request ID: ${data.request.requestId}`
      );

      setFormData({
        wasteType: "",
        quantity: "",
        location: "",
        preferredDate: "",
        preferredTime: "",
        description: "",
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="collection-page">

      <div className="collection-header">
        <div>
          <p className="collection-eyebrow">
            WASTE COLLECTION
          </p>

          <h1>
            Request a Collection
          </h1>

          <p>
            Schedule a pickup for recyclable and household waste.
          </p>
        </div>

        <div className="collection-header-icon">
          <Truck size={34} />
        </div>
      </div>

      <div className="collection-info-card">
        <Truck size={24} />

        <div>
          <strong>Keep your neighborhood clean</strong>
          <p>
            Submit a collection request and our team can
            arrange a convenient pickup.
          </p>
        </div>
      </div>

      {success && (
        <div className="collection-success">
          <CheckCircle size={20} />
          <span>{success}</span>
        </div>
      )}

      {error && (
        <div className="collection-error">
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      <div className="collection-container">

        <form
          className="collection-form"
          onSubmit={handleSubmit}
        >

          <h2>Collection Details</h2>

          <div className="collection-grid">

            {/* Waste Type */}
            <div className="collection-field">
              <label>
                <Package size={16} />
                Waste Type
              </label>

              <select
                name="wasteType"
                value={formData.wasteType}
                onChange={handleChange}
                required
              >
                <option value="">
                  Select waste type
                </option>

                <option value="Plastic">
                  Plastic
                </option>

                <option value="Paper">
                  Paper
                </option>

                <option value="Glass">
                  Glass
                </option>

                <option value="Metal">
                  Metal
                </option>

                <option value="E-Waste">
                  E-Waste
                </option>

                <option value="Organic Waste">
                  Organic Waste
                </option>

                <option value="Mixed Waste">
                  Mixed Waste
                </option>
              </select>
            </div>

            {/* Quantity */}
            <div className="collection-field">
              <label>
                <Package size={16} />
                Approximate Quantity
              </label>

              <input
                type="text"
                name="quantity"
                placeholder="Example: 5 kg"
                value={formData.quantity}
                onChange={handleChange}
                required
              />
            </div>

            {/* Location */}
            <div className="collection-field full-width">
              <label>
                <MapPin size={16} />
                Pickup Location
              </label>

              <input
                type="text"
                name="location"
                placeholder="Enter your pickup location"
                value={formData.location}
                onChange={handleChange}
                required
              />
            </div>

            {/* Date */}
            <div className="collection-field">
              <label>
                <Calendar size={16} />
                Preferred Date
              </label>

              <input
                type="date"
                name="preferredDate"
                value={formData.preferredDate}
                onChange={handleChange}
                required
              />
            </div>

            {/* Time */}
            <div className="collection-field">
              <label>
                <Clock size={16} />
                Preferred Time
              </label>

              <select
                name="preferredTime"
                value={formData.preferredTime}
                onChange={handleChange}
                required
              >
                <option value="">
                  Select time
                </option>

                <option value="9:00 AM - 11:00 AM">
                  9:00 AM - 11:00 AM
                </option>

                <option value="11:00 AM - 1:00 PM">
                  11:00 AM - 1:00 PM
                </option>

                <option value="2:00 PM - 4:00 PM">
                  2:00 PM - 4:00 PM
                </option>

                <option value="4:00 PM - 6:00 PM">
                  4:00 PM - 6:00 PM
                </option>
              </select>
            </div>

            {/* Description */}
            <div className="collection-field full-width">
              <label>
                Additional Details
              </label>

              <textarea
                name="description"
                placeholder="Add any additional information about the waste..."
                value={formData.description}
                onChange={handleChange}
                rows="5"
              />
            </div>

          </div>

          <button
            type="submit"
            className="collection-submit-button"
            disabled={loading}
          >
            <Truck size={19} />

            {loading
              ? "Submitting..."
              : "Request Collection"}
          </button>

        </form>

      </div>
    </div>
  );
}

export default Collection;