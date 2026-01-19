import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import api from "../lib/api";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [params] = useSearchParams();

  // ✅ Token ONLY comes from URL
  const token = params.get("token") || "";

  const [newPassword, setNewPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");
    setMsg("");

    try {
      await api.post("/auth/reset-password", {
        token,
        newPassword,
      });

      setMsg("Password reset successful. Redirecting to login...");
      setTimeout(() => navigate("/login"), 1500);
    } catch (e) {
      setErr(e?.response?.data?.message || "Reset failed");
    }
  }

  return (
    <div className="card" style={{ maxWidth: 520, margin: "80px auto" }}>
      <h2>Reset Password</h2>
      <p className="small">Set a new password for your account.</p>

      {err && <p style={{ color: "crimson" }}>{err}</p>}
      {msg && <p style={{ color: "green" }}>{msg}</p>}

      <form onSubmit={onSubmit} style={{ display: "grid", gap: 12 }}>
        {/* ✅ ONLY password input */}
        <input
          className="input"
          type="password"
          placeholder="New password (min 8 characters)"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />

        <button className="btn" type="submit">
          Reset Password
        </button>
      </form>

      <p className="small" style={{ marginTop: 12 }}>
        Back to <Link to="/login"><b>Login</b></Link>
      </p>
    </div>
  );
}
