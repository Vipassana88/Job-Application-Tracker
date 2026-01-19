import React from "react";

export default function Filters({ status, setStatus, q, setQ }) {
  return (
    <div className="row" style={{ marginBottom: 10 }}>
      <select className="input" value={status} onChange={(e) => setStatus(e.target.value)} style={{ maxWidth: 200 }}>
        <option value="">All Status</option>
        <option value="Applied">Applied</option>
        <option value="Interview">Interview</option>
        <option value="Offer">Offer</option>
        <option value="Rejected">Rejected</option>
      </select>

      <input
        className="input"
        placeholder="Search company / role / location"
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />
    </div>
  );
}
