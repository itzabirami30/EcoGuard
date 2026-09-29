import { API_URL } from "../config";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch(API_URL + "/api/auth/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Registration failed."
        );
      }

      alert("Registration successful! Please login.");

      navigate("/login");
    } catch (err) {
      console.error("Registration error:", err);

      setError(
        err.message ||
          "Unable to register. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>

        {/* Logo */}
        <div style={styles.logo}>♻️</div>

        {/* Heading */}
        <h1 style={styles.heading}>
          Create Account
        </h1>

        <p style={styles.subtitle}>
          Join EcoGuard and help build a cleaner city.
        </p>

        {/* Error Message */}
        {error && (
          <div style={styles.error}>
            {error}
          </div>
        )}

        {/* Registration Form */}
        <form onSubmit={handleRegister}>

          {/* Full Name */}
          <label style={styles.label}>
            Full Name
          </label>

          <input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
            style={styles.input}
            required
          />

          {/* Email */}
          <label style={styles.label}>
            Email
          </label>

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            style={styles.input}
            required
          />

          {/* Password */}
          <label style={styles.label}>
            Password
          </label>

          <input
            type="password"
            placeholder="Create a password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            style={styles.input}
            minLength={6}
            required
          />

          {/* Create Account Button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              ...styles.button,
              opacity: loading ? 0.7 : 1,
              cursor: loading
                ? "not-allowed"
                : "pointer",
            }}
          >
            {loading
              ? "Creating Account..."
              : "Create Account"}
          </button>

        </form>

        {/* Login Link */}
        <p style={styles.bottomText}>
          Already have an account?{" "}

          <Link
            to="/login"
            style={styles.link}
          >
            Login
          </Link>
        </p>

      </div>
    </div>
  );
}

/* ==============================
   STYLES
============================== */

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f5f8f6",
    padding: "30px",
  },

  card: {
    width: "400px",
    padding: "40px",
    background: "white",
    borderRadius: "22px",
    boxShadow:
      "0 20px 60px rgba(30, 90, 75, 0.12)",
  },

  logo: {
    fontSize: "40px",
    textAlign: "center",
    marginBottom: "5px",
  },

  heading: {
    textAlign: "center",
    color: "#173c35",
    margin: "0 0 5px 0",
    fontSize: "38px",
  },

  subtitle: {
    color: "#71857f",
    textAlign: "center",
    lineHeight: "1.6",
    marginBottom: "30px",
    fontSize: "17px",
  },

  label: {
    display: "block",
    marginTop: "18px",
    marginBottom: "7px",
    color: "#173c35",
    fontWeight: "600",
    fontSize: "14px",
  },

  input: {
    display: "block",
    width: "100%",
    padding: "13px 14px",
    border: "1px solid #dce5e1",
    borderRadius: "10px",
    fontSize: "15px",
    outline: "none",
    boxSizing: "border-box",
    background: "#ffffff",
  },

  error: {
    background: "#fff1f0",
    color: "#c0392b",
    border: "1px solid #f3c5c0",
    padding: "12px",
    borderRadius: "10px",
    marginBottom: "20px",
    fontSize: "14px",
    textAlign: "center",
  },

  button: {
    width: "100%",
    marginTop: "25px",
    padding: "14px",
    border: "none",
    borderRadius: "10px",
    background: "#1e5a4b",
    color: "white",
    fontWeight: "bold",
    fontSize: "15px",
  },

  bottomText: {
    marginTop: "25px",
    textAlign: "center",
    color: "#71857f",
    fontSize: "14px",
  },

  link: {
    color: "#1e5a4b",
    fontWeight: "bold",
    textDecoration: "none",
  },
};

export default Register;