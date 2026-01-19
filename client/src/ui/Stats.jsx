import React from "react";

function StatCard({ label, value }) {
  return (
    <div className="card" style={{ flex: 1, minWidth: 160 }}>
      <div className="small">{label}</div>
      <div style={{ fontSize: 26, fontWeight: 700 }}>{value}</div>
    </div>
  );
}

export default function Stats({ stats }) {
  return (
    <div className="row">
      <StatCard label="Total" value={stats.total ?? 0} />
      <StatCard label="Applied" value={stats.Applied ?? 0} />
      <StatCard label="Interview" value={stats.Interview ?? 0} />
      <StatCard label="Offer" value={stats.Offer ?? 0} />
      <StatCard label="Rejected" value={stats.Rejected ?? 0} />
    </div>
  );
}
