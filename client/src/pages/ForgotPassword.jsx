import React, { useState } from "react";
import { Link } from "react-router-dom";
import api from "../lib/api.js";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");
    setMsg("");
    try {
      await api.post("/auth/forgot-password", { email });
      setMsg("If the email exists, a reset link has been sent.");
    } catch (e) {
      setErr(e?.response?.data?.message || "Request failed");
    }
  }

  return (
    <div className="card" style={{ maxWidth: 520, margin: "80px auto" }}>
      <h2>Forgot Password</h2>
      <p className="small">Enter your email to receive a password reset link.</p>

      {err && <p style={{ color: "crimson" }}>{err}</p>}
      {msg && <p style={{ color: "green" }}>{msg}</p>}

      <form onSubmit={onSubmit} style={{ display: "grid", gap: 12, marginTop: 14 }}>
        <input className="input" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <button className="btn" type="submit">Send reset link</button>
      </form>

      <p className="small" style={{ marginTop: 12 }}>
        Back to <Link to="/login"><b>Login</b></Link>
      </p>
    </div>
  );
}
