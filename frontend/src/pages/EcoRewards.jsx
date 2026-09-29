import React, { useEffect, useState } from "react";
import {
  Award,
  Leaf,
  Recycle,
  Truck,
  ScanLine,
  FileText,
  Trophy,
  Star,
  ShieldCheck,
} from "lucide-react";

function EcoRewards() {
  const [reward, setReward] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("ecoguardToken");

  const fetchRewards = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "http://localhost:5000/api/rewards/my",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to load Eco Rewards."
        );
      }

      setReward(data.reward);
    } catch (err) {
      console.error("Rewards error:", err);
      setError(
        err.message || "Unable to load Eco Rewards."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRewards();
  }, []);

  if (loading) {
    return (
      <div className="eco-rewards-page">
        <div className="rewards-loading">
          Loading Eco Rewards...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="eco-rewards-page">
        <div className="rewards-error">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="eco-rewards-page">

      {/* HEADER */}

      <div className="rewards-header">
        <div>
          <div className="rewards-label">
            ECO COMMUNITY
          </div>

          <h1>
            Eco Rewards
          </h1>

          <p>
            Make responsible waste-management
            choices and earn Eco Points.
          </p>
        </div>

        <div className="rewards-header-icon">
          <Award size={32} />
        </div>
      </div>

      {/* MAIN POINTS CARD */}

      <div className="rewards-main-card">

        <div className="rewards-main-left">

          <div className="points-icon">
            <Leaf size={30} />
          </div>

          <div>
            <span>
              YOUR ECO POINTS
            </span>

            <strong>
              {reward?.points || 0}
            </strong>

            <small>
              Keep making your community greener!
            </small>
          </div>

        </div>

        <div className="level-box">
          <Star size={18} />

          <div>
            <span>
              CURRENT LEVEL
            </span>

            <strong>
              {reward?.level || "Eco Beginner"}
            </strong>
          </div>
        </div>

      </div>

      {/* ACTIVITY STATS */}

      <div className="reward-stats">

        <div className="reward-stat-card">
          <div className="reward-stat-icon">
            <FileText size={22} />
          </div>

          <span>
            Waste Reports
          </span>

          <strong>
            {reward?.reportsCompleted || 0}
          </strong>

          <small>
            +20 points each
          </small>
        </div>

        <div className="reward-stat-card">
          <div className="reward-stat-icon">
            <ScanLine size={22} />
          </div>

          <span>
            AI Detections
          </span>

          <strong>
            {reward?.aiDetections || 0}
          </strong>

          <small>
            +10 points each
          </small>
        </div>

        <div className="reward-stat-card">
          <div className="reward-stat-icon">
            <Truck size={22} />
          </div>

          <span>
            Collections
          </span>

          <strong>
            {reward?.collectionsCompleted || 0}
          </strong>

          <small>
            +30 points each
          </small>
        </div>

      </div>

      {/* BADGES */}

      <div className="rewards-section">

        <div className="rewards-section-header">
          <div>
            <h2>
              Your Achievements
            </h2>

            <p>
              Badges you have earned through
              responsible actions.
            </p>
          </div>

          <Trophy size={24} />
        </div>

        {reward?.badges?.length > 0 ? (
          <div className="badges-grid">

            {reward.badges.map((badge, index) => (
              <div
                className="badge-card"
                key={index}
              >
                <div className="badge-icon">
                  <ShieldCheck size={25} />
                </div>

                <div>
                  <strong>
                    {badge}
                  </strong>

                  <span>
                    Achievement unlocked
                  </span>
                </div>
              </div>
            ))}

          </div>
        ) : (
          <div className="no-badges">
            <Award size={35} />

            <h3>
              No badges yet
            </h3>

            <p>
              Complete EcoGuard activities to
              unlock your first badge.
            </p>
          </div>
        )}

      </div>

      {/* HOW TO EARN */}

      <div className="rewards-section">

        <div className="rewards-section-header">
          <div>
            <h2>
              How to Earn Eco Points
            </h2>

            <p>
              Every responsible action contributes
              to a cleaner community.
            </p>
          </div>

          <Recycle size={24} />
        </div>

        <div className="earn-grid">

          <div className="earn-card">
            <FileText size={22} />

            <div>
              <strong>
                Report Waste
              </strong>

              <span>
                Earn 20 Eco Points
              </span>
            </div>
          </div>

          <div className="earn-card">
            <ScanLine size={22} />

            <div>
              <strong>
                Detect Waste with AI
              </strong>

              <span>
                Earn 10 Eco Points
              </span>
            </div>
          </div>

          <div className="earn-card">
            <Truck size={22} />

            <div>
              <strong>
                Complete Collection
              </strong>

              <span>
                Earn 30 Eco Points
              </span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}

export default EcoRewards;