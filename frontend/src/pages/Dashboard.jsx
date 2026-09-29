import React from "react";

import {
  Recycle,
  Truck,
  ShieldCheck,
  AlertTriangle,
  Camera,
  FileWarning,
  ArrowRight,
  Leaf,
  MapPin,
} from "lucide-react";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import StatCard from "../components/StatCard";

function Dashboard() {

  return (
    <div className="dashboard-layout">

      <Navbar />

      <Sidebar />

      <main className="dashboard-main">

        {/* HEADER */}

        <div className="dashboard-header">

          <div>
            <p className="welcome-text">
              Welcome back 👋
            </p>

            <h1>
              Good Morning, Eco Citizen!
            </h1>

            <p className="dashboard-description">
              Together, let's keep our city clean and green.
            </p>
          </div>

          <button className="report-main-button">
            <FileWarning size={18} />
            Report Waste
          </button>

        </div>


        {/* STAT CARDS */}

        <div className="stats-grid">

          <StatCard
            icon={<Recycle size={23} />}
            title="Waste Reports"
            value="24"
            description="+12% this month"
            type="green"
          />

          <StatCard
            icon={<Truck size={23} />}
            title="Collections"
            value="16"
            description="3 pending"
            type="blue"
          />

          <StatCard
            icon={<ShieldCheck size={23} />}
            title="Resolved Issues"
            value="18"
            description="92% success rate"
            type="purple"
          />

          <StatCard
            icon={<AlertTriangle size={23} />}
            title="Active Issues"
            value="3"
            description="Needs attention"
            type="orange"
          />

        </div>


        {/* QUICK ACTIONS */}

        <section className="dashboard-section">

          <div className="section-title-row">

            <div>
              <h2>Quick Actions</h2>

              <p>
                What would you like to do today?
              </p>
            </div>

          </div>


          <div className="quick-actions">

            <a href="/waste-detection" className="action-card">

              <div className="action-icon green-bg">
                <Camera />
              </div>

              <div>
                <strong>Detect Waste</strong>

                <span>
                  Identify waste using AI
                </span>
              </div>

              <ArrowRight size={18} />

            </a>


            <a href="/report-waste" className="action-card">

              <div className="action-icon orange-bg">
                <FileWarning />
              </div>

              <div>
                <strong>Report an Issue</strong>

                <span>
                  Report garbage or sanitation problems
                </span>
              </div>

              <ArrowRight size={18} />

            </a>


            <a href="/collection" className="action-card">

              <div className="action-icon blue-bg">
                <Truck />
              </div>

              <div>
                <strong>Request Collection</strong>

                <span>
                  Schedule waste pickup
                </span>
              </div>

              <ArrowRight size={18} />

            </a>

          </div>

        </section>


        {/* TWO COLUMN SECTION */}

        <div className="dashboard-columns">


          {/* RECENT REPORTS */}

          <section className="dashboard-section recent-section">

            <div className="section-title-row">

              <div>
                <h2>Recent Reports</h2>

                <p>
                  Your latest waste reports
                </p>
              </div>

              <a href="/my-reports">
                View All
              </a>

            </div>


            <div className="reports-list">

              <Report
                icon={<Recycle />}
                title="Plastic Waste"
                location="Ward 12"
                status="Pending"
                statusClass="pending"
              />

              <Report
                icon={<AlertTriangle />}
                title="Garbage Overflow"
                location="Anna Nagar"
                status="In Progress"
                statusClass="progress-status"
              />

              <Report
                icon={<Leaf />}
                title="Organic Waste"
                location="Green Park"
                status="Resolved"
                statusClass="resolved"
              />

            </div>

          </section>


          {/* CLEANLINESS SCORE */}

          <section className="dashboard-section">

            <div className="section-title-row">

              <div>
                <h2>My Eco Impact</h2>

                <p>
                  Your contribution this month
                </p>
              </div>

              <Leaf size={21} />

            </div>


            <div className="eco-score">

              <div className="score-circle">

                <strong>
                  82
                </strong>

                <span>
                  /100
                </span>

              </div>

              <div>

                <strong className="score-title">
                  Great work! 🌱
                </strong>

                <p>
                  You're helping make your
                  community cleaner.
                </p>

              </div>

            </div>


            <div className="impact-stats">

              <div>
                <strong>240</strong>
                <span>Eco Points</span>
              </div>

              <div>
                <strong>18</strong>
                <span>Reports</span>
              </div>

              <div>
                <strong>7</strong>
                <span>Collections</span>
              </div>

            </div>

          </section>

        </div>


        {/* HOTSPOT */}

        <section className="hotspot-card">

          <div className="hotspot-icon">
            <MapPin size={23} />
          </div>

          <div>

            <strong>
              Garbage Hotspot Near You
            </strong>

            <p>
              Ward 12 • 1.2 km away • High Priority
            </p>

          </div>

          <button>
            View Location
            <ArrowRight size={16} />
          </button>

        </section>

      </main>

    </div>
  );
}


/* REPORT COMPONENT */

function Report({
  icon,
  title,
  location,
  status,
  statusClass
}) {

  return (

    <div className="report-row">

      <div className="report-left">

        <div className="report-icon">
          {icon}
        </div>

        <div>

          <strong>
            {title}
          </strong>

          <span>
            {location}
          </span>

        </div>

      </div>

      <span className={`report-status ${statusClass}`}>
        {status}
      </span>

    </div>

  );
}

export default Dashboard;