import React, { useEffect, useMemo, useState } from "react";
import { clearAuth, getUser } from "../lib/auth.js";
import api from "../lib/api.js";
import JobForm from "../ui/JobForm.jsx";
import JobList from "../ui/JobList.jsx";
import Filters from "../ui/Filters.jsx";
import Stats from "../ui/Stats.jsx";

export default function Dashboard() {
  const user = getUser();
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);

  const [status, setStatus] = useState("");
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);

  const [selected, setSelected] = useState(null);
  const [stats, setStats] = useState({ Applied: 0, Interview: 0, Offer: 0, Rejected: 0, total: 0 });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const query = useMemo(() => ({ status, q, page, limit: 10 }), [status, q, page]);

  async function loadJobs() {
    setLoading(true);
    setErr("");
    try {
      const res = await api.get("/jobs", { params: query });
      setItems(res.data.items);
      setTotal(res.data.total);
    } catch (e) {
      setErr(e?.response?.data?.message || "Failed to load jobs");
    } finally {
      setLoading(false);
    }
  }

  async function loadStats() {
    try {
      const res = await api.get("/jobs/stats/summary");
      setStats(res.data);
    } catch {
      // ignore stats errors; list still works
    }
  }

  useEffect(() => {
    loadJobs();
    loadStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, q, page]);

  async function onCreate(payload) {
    await api.post("/jobs", payload);
    setPage(1);
    await loadJobs();
    await loadStats();
  }

  async function onUpdate(id, payload) {
    await api.patch(`/jobs/${id}`, payload);
    setSelected(null);
    await loadJobs();
    await loadStats();
  }

  async function onDelete(id) {
    await api.delete(`/jobs/${id}`);
    if (selected?._id === id) setSelected(null);
    await loadJobs();
    await loadStats();
  }

  function logout() {
    clearAuth();
    window.location.href = "/login";
  }

  const pages = Math.max(1, Math.ceil(total / 10));

  return (
    <>
      <div className="header">
        <div>
          <h2 style={{ margin: 0 }}>Job Tracker</h2>
          <div className="small">Welcome, {user?.name || "User"}</div>
        </div>
        <div className="nav">
          <button className="btn secondary" onClick={logout}>Logout</button>
        </div>
      </div>

      <Stats stats={stats} />

      <div className="grid" style={{ marginTop: 12 }}>
        <div className="card">
          <h3 style={{ marginTop: 0 }}>{selected ? "Edit Application" : "Add Application"}</h3>
          <JobForm
            selected={selected}
            onCancel={() => setSelected(null)}
            onCreate={onCreate}
            onUpdate={onUpdate}
          />
        </div>

        <div className="card">
          <h3 style={{ marginTop: 0 }}>Applications</h3>
          <Filters
            status={status}
            setStatus={(v) => { setPage(1); setStatus(v); }}
            q={q}
            setQ={(v) => { setPage(1); setQ(v); }}
          />

          {err && <p style={{ color: "crimson" }}>{err}</p>}
          {loading ? <p className="small">Loading...</p> : (
            <JobList items={items} onEdit={setSelected} onDelete={onDelete} />
          )}

          <div className="pagination" style={{ marginTop: 10 }}>
            <button
              className="btn secondary"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
            >
              Prev
            </button>

            <div className="small">Page {page} / {pages}</div>

              <button
                className="btn secondary"
                disabled={page >= pages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </button>
          </div>

        </div>
      </div>
    </>
  );
}
