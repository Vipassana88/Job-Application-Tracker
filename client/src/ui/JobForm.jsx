import React, { useEffect, useState } from "react";

const empty = {
  company: "",
  role: "",
  location: "",
  status: "Applied",
  appliedDate: "",
  link: "",
  notes: "",
};

export default function JobForm({ selected, onCancel, onCreate, onUpdate }) {
  const [form, setForm] = useState(empty);
  const [err, setErr] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (selected) {
      setForm({
        company: selected.company || "",
        role: selected.role || "",
        location: selected.location || "",
        status: selected.status || "Applied",
        appliedDate: selected.appliedDate ? new Date(selected.appliedDate).toISOString().slice(0, 10) : "",
        link: selected.link || "",
        notes: selected.notes || "",
      });
    } else {
      setForm(empty);
    }
  }, [selected]);

  function update(k, v) {
    setForm((p) => ({ ...p, [k]: v }));
  }

  async function submit(e) {
    e.preventDefault();
    setErr("");
    setSaving(true);
    try {
      const payload = {
        ...form,
        appliedDate: form.appliedDate ? new Date(form.appliedDate).toISOString() : undefined,
      };
      if (selected) await onUpdate(selected._id, payload);
      else await onCreate(payload);
      setForm(empty);
    } catch (e) {
      setErr(e?.response?.data?.message || "Save failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={submit} className="row" style={{ flexDirection: "column" }}>
      {err && <p style={{ color: "crimson" }}>{err}</p>}

      <input className="input" placeholder="Company *" value={form.company} onChange={(e) => update("company", e.target.value)} />
      <input className="input" placeholder="Role *" value={form.role} onChange={(e) => update("role", e.target.value)} />
      <input className="input" placeholder="Location" value={form.location} onChange={(e) => update("location", e.target.value)} />

      <select className="input" value={form.status} onChange={(e) => update("status", e.target.value)}>
        <option value="Applied">Applied</option>
        <option value="Interview">Interview</option>
        <option value="Offer">Offer</option>
        <option value="Rejected">Rejected</option>
      </select>

      <input className="input" type="date" value={form.appliedDate} onChange={(e) => update("appliedDate", e.target.value)} />

      <input className="input" placeholder="Job link (optional)" value={form.link} onChange={(e) => update("link", e.target.value)} />

      <textarea className="input" rows={4} placeholder="Notes (optional)" value={form.notes} onChange={(e) => update("notes", e.target.value)} />

      <div className="row">
        <button className="btn" type="submit" disabled={saving}>
          {saving ? "Saving..." : selected ? "Update" : "Add"}
        </button>
        {selected && (
          <button type="button" className="btn secondary" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>

      <p className="small" style={{ marginTop: 8 }}>
        Tip: Add 8–12 applications to make your dashboard look real.
      </p>
    </form>
  );
}
