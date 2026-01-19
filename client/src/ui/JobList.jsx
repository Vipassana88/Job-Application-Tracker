import React from "react";

export default function JobList({ items, onEdit, onDelete }) {
  if (!items?.length) return <p className="small">No applications yet. Add one on the left.</p>;

  return (
    <table className="table">
      <thead>
        <tr>
          <th>Company</th>
          <th>Role</th>
          <th>Status</th>
          <th className="small">Actions</th>
        </tr>
      </thead>
      <tbody>
        {items.map((job) => (
          <tr key={job._id}>
            <td>
              <div><b>{job.company}</b></div>
              <div className="small">{job.location || "-"}</div>
            </td>
            <td>
              <div>{job.role}</div>
              <div className="small">
                {job.link ? <a href={job.link} target="_blank" rel="noreferrer">Link</a> : "No link"}
              </div>
            </td>
            <td><span className="badge">{job.status}</span></td>
            <td>
              <div className="row">
                <button className="btn secondary" onClick={() => onEdit(job)}>Edit</button>
                <button className="btn danger" onClick={() => onDelete(job._id)}>Delete</button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
