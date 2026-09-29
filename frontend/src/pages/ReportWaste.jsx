import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FileText,
  MapPin,
  AlertTriangle,
  Upload,
  CheckCircle,
  ArrowLeft,
} from "lucide-react";

function ReportWaste() {
  const [formData, setFormData] = useState({
    wasteType: "",
    location: "",
    severity: "Low",
    description: "",
  });

  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [submittedReport, setSubmittedReport] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setSuccess("");
    setError("");
    setSubmittedReport(null);

    try {
      // Get JWT token from browser
      const token = localStorage.getItem(
        "ecoguardToken"
      );

      if (!token) {
        throw new Error(
          "Please login before submitting a report."
        );
      }

      const response = await fetch(
        "http://localhost:5000/api/reports",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",

            // Send JWT token
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            wasteType: formData.wasteType,
            location: formData.location,
            severity: formData.severity,
            description: formData.description,
            hasImage: !!image,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to submit report."
        );
      }

      setSuccess(
        "Waste report submitted successfully!"
      );

      setSubmittedReport(data.report);

      // Clear form
      setFormData({
        wasteType: "",
        location: "",
        severity: "Low",
        description: "",
      });

      setImage(null);
      setImagePreview(null);

    } catch (err) {
      console.error("Report submission error:", err);

      setError(
        err.message ||
          "Unable to submit report. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="report-waste-page">

      {/* HEADER */}
      <div className="report-waste-header">

        <div>
          <div className="page-label">
            COMMUNITY ACTION
          </div>

          <h1>Report Waste</h1>

          <p>
            Report waste and sanitation issues in
            your community.
          </p>
        </div>

        <Link
          to="/dashboard"
          className="back-dashboard"
        >
          <ArrowLeft size={16} />
          Dashboard
        </Link>

      </div>

      {/* SUCCESS MESSAGE */}
      {success && submittedReport && (
        <div className="report-success">

          <CheckCircle size={24} />

          <div>
            <strong>
              {success}
            </strong>

            <p>
              Your report ID is{" "}
              <strong>
                {submittedReport.reportId}
              </strong>
              .
            </p>

            <span>
              Status:{" "}
              {submittedReport.status}
            </span>
          </div>

        </div>
      )}

      {/* ERROR MESSAGE */}
      {error && (
        <div className="report-error">

          <AlertTriangle size={22} />

          <div>
            <strong>
              Unable to submit report
            </strong>

            <p>{error}</p>
          </div>

        </div>
      )}

      {/* FORM */}
      <div className="report-waste-container">

        <form
          className="report-waste-form"
          onSubmit={handleSubmit}
        >

          {/* WASTE TYPE */}
          <div className="form-group">

            <label>
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

              <option value="Organic Waste">
                Organic Waste
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

              <option value="Mixed Waste">
                Mixed Waste
              </option>

              <option value="Other">
                Other
              </option>
            </select>

          </div>

          {/* LOCATION */}
          <div className="form-group">

            <label>
              <MapPin size={16} />
              Location
            </label>

            <input
              type="text"
              name="location"
              placeholder="Enter waste location"
              value={formData.location}
              onChange={handleChange}
              required
            />

          </div>

          {/* SEVERITY */}
          <div className="form-group">

            <label>
              <AlertTriangle size={16} />
              Severity
            </label>

            <select
              name="severity"
              value={formData.severity}
              onChange={handleChange}
              required
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

          </div>

          {/* DESCRIPTION */}
          <div className="form-group">

            <label>
              <FileText size={16} />
              Description
            </label>

            <textarea
              name="description"
              placeholder="Describe the waste or sanitation issue..."
              value={formData.description}
              onChange={handleChange}
              rows="5"
              required
            />

          </div>

          {/* IMAGE */}
          <div className="form-group">

            <label>
              <Upload size={16} />
              Evidence Photo
            </label>

            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />

            {imagePreview && (
              <div
                style={{
                  marginTop: "15px",
                }}
              >
                <img
                  src={imagePreview}
                  alt="Waste preview"
                  style={{
                    width: "180px",
                    height: "130px",
                    objectFit: "cover",
                    borderRadius: "12px",
                  }}
                />
              </div>
            )}

          </div>

          {/* SUBMIT */}
          <button
            type="submit"
            className="submit-report-button"
            disabled={loading}
          >
            {loading
              ? "Submitting..."
              : "Submit Waste Report"}
          </button>

        </form>

      </div>

    </div>
  );
}

export default ReportWaste;