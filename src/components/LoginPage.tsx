// src/components/LoginPage.tsx

import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import type { User } from "../types";

async function mockLogin(email: string, password: string) {
  await new Promise((r) => setTimeout(r, 1200));
  if (!email.includes("@") || password.length < 4) {
    throw new Error("Invalid credentials. Try student@campus.edu / pass1234");
  }
  const user: User = {
    id: "usr_9f3k2m",
    name: "Arjun Mehta",
    email,
    role: "student",
    department: "Computer Science",
    year: 3,
    avatar_url: "",
    notification_preferences: {
      placement: true,
      events: true,
      result: true,
      announcement: true,
    } as Record<string, boolean>,
  };
  return {
    data: {
      user,
      tokens: {
        access_token: "mock_access_token_xyz",
        refresh_token: "mock_refresh_token_abc",
        expires_in: 3600,
        token_type: "Bearer",
      },
    },
  };
}

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState("student@campus.edu");
  const [password, setPassword] = useState("pass1234");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await mockLogin(email, password) as { data: { user: User; tokens: { access_token: string; refresh_token: string } } };
      login(res.data.user, res.data.tokens.access_token, res.data.tokens.refresh_token);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.leftPanel}>
        <div style={styles.brandArea}>
          <div style={styles.logo}>CN</div>
          <h1 style={styles.brandName}>CampusNotify</h1>
          <p style={styles.tagline}>
            Stay ahead — every placement drive, exam result, and campus event,
            delivered in real time.
          </p>
          <div style={styles.featureList}>
            {[
              "Real-time placement alerts",
              "Instant result notifications",
              "Campus event updates",
              "Personalized feed",
            ].map((f) => (
              <div key={f} style={styles.featureItem}>
                <span style={styles.featureDot} />
                {f}
              </div>
            ))}
          </div>
        </div>
        <div style={styles.decorGrid}>
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} style={{ ...styles.decorCell, opacity: 0.04 + (i % 3) * 0.03 }} />
          ))}
        </div>
      </div>

      <div style={styles.rightPanel}>
        <div style={styles.formCard}>
          <div style={styles.formHeader}>
            <h2 style={styles.formTitle}>Welcome back</h2>
            <p style={styles.formSubtitle}>Sign in to your campus account</p>
          </div>

          <form onSubmit={handleLogin} style={styles.form}>
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Email Address</label>
              <input
                style={styles.input}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@campus.edu"
                required
              />
            </div>
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Password</label>
              <input
                style={styles.input}
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>

            {error && <div style={styles.errorBox}>{error}</div>}

            <button style={styles.loginBtn} type="submit" disabled={loading}>
              {loading ? (
                <span style={styles.spinner} />
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <p style={styles.hint}>
            Demo: <strong>student@campus.edu</strong> / <strong>pass1234</strong>
          </p>
        </div>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    display: "flex",
    minHeight: "100vh",
    fontFamily: "'DM Sans', sans-serif",
    background: "#0A0A0F",
  },
  leftPanel: {
    flex: 1,
    background: "linear-gradient(135deg, #0D1117 0%, #111827 100%)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    padding: "4rem",
    position: "relative",
    overflow: "hidden",
    borderRight: "1px solid rgba(255,255,255,0.05)",
  },
  decorGrid: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gridTemplateRows: "repeat(3, 1fr)",
    pointerEvents: "none",
  },
  decorCell: {
    border: "1px solid rgba(110,231,183,0.15)",
  },
  brandArea: { position: "relative", zIndex: 1 },
  logo: {
    width: 56,
    height: 56,
    background: "linear-gradient(135deg, #6EE7B7, #3B82F6)",
    borderRadius: 14,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 800,
    fontSize: 20,
    color: "#0A0A0F",
    marginBottom: 24,
    letterSpacing: "-0.5px",
  },
  brandName: {
    fontSize: "2.5rem",
    fontWeight: 800,
    color: "#F9FAFB",
    margin: "0 0 12px 0",
    letterSpacing: "-1px",
  },
  tagline: {
    fontSize: "1.05rem",
    color: "rgba(249,250,251,0.5)",
    lineHeight: 1.7,
    maxWidth: 380,
    marginBottom: 40,
  },
  featureList: { display: "flex", flexDirection: "column", gap: 14 },
  featureItem: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    color: "rgba(249,250,251,0.7)",
    fontSize: "0.95rem",
  },
  featureDot: {
    width: 8,
    height: 8,
    borderRadius: "50%",
    background: "#6EE7B7",
    flexShrink: 0,
  },
  rightPanel: {
    width: 480,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "2rem",
    background: "#0A0A0F",
  },
  formCard: {
    width: "100%",
    maxWidth: 400,
  },
  formHeader: { marginBottom: 36 },
  formTitle: {
    fontSize: "1.8rem",
    fontWeight: 700,
    color: "#F9FAFB",
    margin: "0 0 8px 0",
    letterSpacing: "-0.5px",
  },
  formSubtitle: { color: "rgba(249,250,251,0.45)", fontSize: "0.95rem", margin: 0 },
  form: { display: "flex", flexDirection: "column", gap: 20 },
  fieldGroup: { display: "flex", flexDirection: "column", gap: 8 },
  label: { fontSize: "0.85rem", color: "rgba(249,250,251,0.6)", fontWeight: 500 },
  input: {
    padding: "12px 16px",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 10,
    color: "#F9FAFB",
    fontSize: "0.95rem",
    outline: "none",
    transition: "border-color 0.2s",
  },
  errorBox: {
    background: "rgba(239,68,68,0.1)",
    border: "1px solid rgba(239,68,68,0.3)",
    color: "#FCA5A5",
    padding: "10px 14px",
    borderRadius: 8,
    fontSize: "0.875rem",
  },
  loginBtn: {
    padding: "14px",
    background: "linear-gradient(135deg, #6EE7B7, #3B82F6)",
    border: "none",
    borderRadius: 10,
    color: "#0A0A0F",
    fontSize: "0.95rem",
    fontWeight: 700,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    letterSpacing: "0.3px",
    marginTop: 4,
  },
  spinner: {
    width: 18,
    height: 18,
    border: "2px solid rgba(10,10,15,0.3)",
    borderTop: "2px solid #0A0A0F",
    borderRadius: "50%",
    animation: "spin 0.7s linear infinite",
  },
  hint: {
    marginTop: 24,
    color: "rgba(249,250,251,0.3)",
    fontSize: "0.8rem",
    textAlign: "center",
  },
};
