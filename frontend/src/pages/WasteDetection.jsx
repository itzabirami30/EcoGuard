import { API_URL } from "../config";
import React, { useState } from "react";
import {
  Camera,
  Upload,
  Recycle,
  CheckCircle,
  AlertTriangle,
  RotateCcw,
  Trash2,
} from "lucide-react";

function WasteDetection() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];

    if (!file) return;

    setSelectedImage(file);
    setImagePreview(URL.createObjectURL(file));
    setResult(null);
  };

  const analyzeWaste = async () => {
    if (!selectedImage) return;

    setAnalyzing(true);
    setResult(null);

    try {
      // ==========================================
      // 1. SEND IMAGE TO AI
      // ==========================================

      const formData = new FormData();

      formData.append("image", selectedImage);

      const response = await fetch(API_URL + "/api/detection", {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to analyze waste image."
        );
      }

      // Show AI result
      setResult(data.result);

      // ==========================================
      // 2. ADD 10 ECO POINTS
      // ==========================================

      const token = localStorage.getItem(
        "ecoguardToken"
      );

      if (token) {
        try {
          const rewardResponse = await fetch(API_URL + "/api/rewards/add", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token,
              },
              body: JSON.stringify({
                action: "ai_detection",
              }),
            }
          );

          const rewardData =
            await rewardResponse.json();

          if (!rewardResponse.ok) {
            console.error(
              "Reward update failed:",
              rewardData.message
            );
          } else {
            console.log(
              "Eco Points added:",
              rewardData.message
            );
          }
        } catch (rewardError) {
          console.error(
            "Eco reward update error:",
            rewardError
          );
        }
      }
    } catch (error) {
      console.error(
        "Waste detection error:",
        error
      );

      alert(
        "Unable to analyze the image. Please make sure the backend is running."
      );
    } finally {
      setAnalyzing(false);
    }
  };

  const resetDetection = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setResult(null);
    setAnalyzing(false);
  };

  return (
    <div className="detection-page">

      {/* HEADER */}

      <div className="detection-header">

        <div>

          <div className="page-label">
            AI POWERED
          </div>

          <h1>
            Waste Detection
          </h1>

          <p>
            Upload a waste image and let EcoGuard identify
            the correct waste category and disposal method.
          </p>

        </div>

        <div className="detection-header-icon">
          <Recycle size={30} />
        </div>

      </div>


      {/* MAIN CONTENT */}

      <div className="detection-grid">

        {/* LEFT SIDE */}

        <div className="detection-card">

          <div className="card-heading">

            <div>

              <h2>
                Upload Waste Image
              </h2>

              <p>
                Take a photo or choose an image from your device.
              </p>

            </div>

            <Camera size={22} />

          </div>


          {!imagePreview ? (

            <label className="upload-area">

              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                hidden
              />

              <div className="upload-icon">
                <Upload size={28} />
              </div>

              <strong>
                Upload a waste image
              </strong>

              <span>
                PNG, JPG or JPEG
              </span>

              <div className="choose-image-button">
                Choose Image
              </div>

            </label>

          ) : (

            <div className="preview-container">

              <img
                src={imagePreview}
                alt="Selected waste"
                className="waste-preview"
              />

              <button
                className="remove-image"
                onClick={resetDetection}
              >
                <Trash2 size={17} />
                Remove
              </button>

            </div>

          )}


          {selectedImage && !result && (

            <button
              className="analyze-button"
              onClick={analyzeWaste}
              disabled={analyzing}
            >

              {analyzing ? (
                <>
                  <span className="spinner"></span>
                  Analyzing Waste...
                </>
              ) : (
                <>
                  <Recycle size={19} />
                  Analyze Waste
                </>
              )}

            </button>

          )}


          {result && (

            <button
              className="reset-button"
              onClick={resetDetection}
            >
              <RotateCcw size={17} />
              Analyze Another Image
            </button>

          )}

        </div>


        {/* RIGHT SIDE */}

        <div className="result-card">

          {!result ? (

            <div className="empty-result">

              <div className="empty-result-icon">
                <Recycle size={38} />
              </div>

              <h2>
                AI Analysis
              </h2>

              <p>
                Your waste classification results
                will appear here.
              </p>

              <div className="analysis-steps">

                <div>
                  <span>1</span>
                  Upload an image
                </div>

                <div>
                  <span>2</span>
                  AI identifies the waste
                </div>

                <div>
                  <span>3</span>
                  Get disposal recommendation
                </div>

              </div>

            </div>

          ) : (

            <div className="result-content">

              <div className="result-success">
                <CheckCircle size={20} />
                Analysis Complete
              </div>


              <h2>
                {result.wasteType}
              </h2>


              <div className="category-badge">
                <Recycle size={16} />
                {result.category}
              </div>


              {/* CONFIDENCE */}

              <div className="confidence-section">

                <div className="confidence-heading">

                  <span>
                    AI Confidence
                  </span>

                  <strong>
                    {result.confidence}%
                  </strong>

                </div>

                <div className="confidence-bar">

                  <div
                    className="confidence-fill"
                    style={{
                      width:
                        result.confidence + "%",
                    }}
                  ></div>

                </div>

              </div>


              {/* BIN */}

              <div className="recommendation-box">

                <div className="recommendation-icon">
                  <Trash2 size={21} />
                </div>

                <div>

                  <span>
                    Recommended Bin
                  </span>

                  <strong>
                    {result.bin}
                  </strong>

                </div>

              </div>


              {/* DISPOSAL */}

              <div className="instruction-box">

                <div className="instruction-title">
                  <CheckCircle size={17} />
                  Disposal Recommendation
                </div>

                <p>
                  {result.disposal}
                </p>

              </div>


              {/* IMPACT */}

              <div className="impact-box">

                <div className="impact-title">
                  🌱 Environmental Impact
                </div>

                <p>
                  {result.environmentalImpact}
                </p>

              </div>


              {/* WARNING */}

              <div className="ai-note">

                <AlertTriangle size={16} />

                <span>
                  AI results are recommendations.
                  Always follow your local waste-management
                  guidelines.
                </span>

              </div>

            </div>

          )}

        </div>

      </div>

    </div>
  );
}

export default WasteDetection;