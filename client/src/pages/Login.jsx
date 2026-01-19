import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../lib/api.js";
import { saveAuth } from "../lib/auth.js";

export default function Login() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");
    try {
      const res = await api.post("/auth/login", { email, password });
      saveAuth(res.data);
      nav("/dashboard");
    } catch (e) {
      setErr(e?.response?.data?.message || "Login failed");
    }
  }

  return (
    <div className="card" style={{ maxWidth: 520, margin: "60px auto" }}>
      <h2>Login</h2>
      <p className="small">Use the same email/password you registered with.</p>
      {err && <p style={{ color: "crimson" }}>{err}</p>}
      <form onSubmit={onSubmit} className="row" style={{ flexDirection: "column" }}>
        <input className="input" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input className="input" placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button className="btn" type="submit">Sign In</button>
      </form>
      <p className="small" style={{ marginTop: 12 }}>
        No account? <Link to="/register"><b>Create one</b></Link>
      </p>
    </div>
  );
}
