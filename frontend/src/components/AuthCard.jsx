// src/components/AuthCard.jsx
import { useState } from "react";

export default function AuthCard({ loading, error, onLogin, onSignup }) {
  const [mode, setMode] = useState("login"); // login | signup
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState(""); // optional
  const [password, setPassword] = useState("");

  async function submit(e) {
    e.preventDefault();
    if (mode === "login") return onLogin({ username, password });
    return onSignup({ username, email, password });
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: "100%", maxWidth: 560, padding: "0 24px" }}>
        <div style={{ marginBottom: 48, textAlign: "center" }}>
          <h1 style={{ fontSize: 28, fontWeight: 500, margin: 0, marginBottom: 8, letterSpacing: "-0.03em" }}>
            Job Tracker
          </h1>
          <p style={{ fontSize: 15, color: "#78716C", margin: 0 }}>
            {mode === "login" ? "Sign in to continue" : "Create your account"}
          </p>
        </div>

        <form onSubmit={submit} style={{ display: "grid", gap: 24 }}>
          <div>
            <label className="label">Username</label>
            <input className="input" value={username} onChange={(e) => setUsername(e.target.value)} required />
          </div>

          {mode === "signup" && (
            <div>
              <label className="label">Email (optional)</label>
              <input
                className="input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
              />
            </div>
          )}

          <div>
            <label className="label">Password</label>
            <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>

          <button
            disabled={loading}
            className="btn btnPrimary"
            style={{ width: "100%", padding: "14px 24px", fontSize: 15, fontWeight: 500, opacity: loading ? 0.75 : 1 }}
          >
            {loading
              ? mode === "login"
                ? "Signing in..."
                : "Creating account..."
              : mode === "login"
              ? "Sign in"
              : "Create account"}
          </button>

          <div style={{ textAlign: "center", fontSize: 14, color: "#78716C" }}>
            {mode === "login" ? (
              <>
                <span>New here? </span>
                <button
                  type="button"
                  onClick={() => setMode("signup")}
                  style={{
                    background: "none",
                    border: "none",
                    padding: 0,
                    margin: 0,
                    color: "#1C1917",
                    cursor: "pointer",
                    fontFamily: "inherit",
                    fontSize: 14,
                    fontWeight: 500,
                    textDecoration: "underline",
                    textUnderlineOffset: 3,
                  }}
                >
                  Create an account
                </button>
              </>
            ) : (
              <>
                <span>Already have an account? </span>
                <button
                  type="button"
                  onClick={() => setMode("login")}
                  style={{
                    background: "none",
                    border: "none",
                    padding: 0,
                    margin: 0,
                    color: "#1C1917",
                    cursor: "pointer",
                    fontFamily: "inherit",
                    fontSize: 14,
                    fontWeight: 500,
                    textDecoration: "underline",
                    textUnderlineOffset: 3,
                  }}
                >
                  Sign in
                </button>
              </>
            )}
          </div>
        </form>

        {error && (
          <div
            style={{
              marginTop: 24,
              padding: "14px 16px",
              background: "#FEF2F2",
              border: "1px solid #FEE2E2",
              borderRadius: 6,
              fontSize: 14,
              color: "#991B1B",
              letterSpacing: "-0.01em",
            }}
          >
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
