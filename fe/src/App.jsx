// src/App.jsx
import { useEffect, useMemo, useState } from "react";
import AuthCard from "./components/AuthCard.jsx";
import ApplicationCard from "./components/ApplicationCard.jsx";
import {
  login,
  signup,
  fetchApplications,
  getToken,
  clearToken,
  createApplication,
  updateApplication,
  deleteApplication,
} from "./api";

const STATUSES = ["APPLIED", "SCREENING", "INTERVIEW", "OFFER", "REJECTED"];

export default function App() {
  const [apps, setApps] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    company_name: "",
    role_title: "",
    status: "APPLIED",
    applied_date: "",
    notes: "",
  });

  const [editingId, setEditingId] = useState(null);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [showAddForm, setShowAddForm] = useState(false);

  const isAuthed = !!getToken();

  async function loadApps() {
    setLoading(true);
    setError("");
    try {
      const data = await fetchApplications();
      setApps(data);
    } catch (e) {
      setError(e.message);
      setApps([]);
    } finally {
      setLoading(false);
    }
  }

  async function onLogin({ username, password }) {
    setLoading(true);
    setError("");
    try {
      await login(username, password);
      await loadApps();
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function onSignup({ username, email, password }) {
    setLoading(true);
    setError("");
    try {
      await signup(username, email, password);
      setError("Account created. Please sign in.");
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  function resetForm() {
    setForm({
      company_name: "",
      role_title: "",
      status: "APPLIED",
      applied_date: "",
      notes: "",
    });
  }

  function handleLogout() {
    clearToken();
    setApps([]);
    setError("");
    setEditingId(null);
    setShowAddForm(false);
    resetForm();
  }

  function startEdit(app) {
    setEditingId(app.id);
    setShowAddForm(true);
    setForm({
      company_name: app.company_name || "",
      role_title: app.role_title || "",
      status: app.status || "APPLIED",
      applied_date: app.applied_date || "",
      notes: app.notes || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function cancelEdit() {
    setEditingId(null);
    setShowAddForm(false);
    resetForm();
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      if (editingId) {
        await updateApplication(editingId, form);
        setEditingId(null);
      } else {
        await createApplication(form);
      }
      resetForm();
      setShowAddForm(false);
      await loadApps();
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Delete this application?")) return;
    setLoading(true);
    setError("");
    try {
      await deleteApplication(id);
      await loadApps();
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (getToken()) loadApps();
  }, []);

  const filteredApps = useMemo(() => {
    const q = query.trim().toLowerCase();
    return apps.filter((a) => {
      const matchesQuery =
        !q ||
        (a.company_name || "").toLowerCase().includes(q) ||
        (a.role_title || "").toLowerCase().includes(q);
      const matchesStatus = statusFilter === "ALL" ? true : a.status === statusFilter;
      return matchesQuery && matchesStatus;
    });
  }, [apps, query, statusFilter]);

  const stats = useMemo(() => {
    const counts = STATUSES.reduce((acc, s) => ({ ...acc, [s]: 0 }), {});
    for (const a of apps) {
      if (a?.status && counts[a.status] !== undefined) counts[a.status] += 1;
    }
    return { total: apps.length, ...counts };
  }, [apps]);

  if (!isAuthed) {
    return <AuthCard loading={loading} error={error} onLogin={onLogin} onSignup={onSignup} />;
  }

  return (
    <div style={{ minHeight: "100vh", paddingBottom: 120 }}>
      {/* Sticky header */}
      <div style={{ borderBottom: "1px solid var(--border)", background: "var(--surface)", position: "sticky", top: 0, zIndex: 100 }}>
        <div className="container" style={{ paddingTop: 24, paddingBottom: 24, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h1 style={{ fontSize: 20, fontWeight: 500, margin: 0, letterSpacing: "-0.02em" }}>Job Tracker</h1>
          <button className="btn" style={{ padding: "8px 16px", fontSize: 14, color: "var(--muted-2)" }} onClick={handleLogout}>
            Sign out
          </button>
        </div>
      </div>

      <div className="container" style={{ paddingTop: 44 }}>

        {/* Error message */}
        {error && (
          <div style={{ marginTop: 40, padding: "16px 20px", background: "#FEF2F2", border: "1px solid #FEE2E2", borderRadius: 6, fontSize: 14, color: "#991B1B", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span>{error}</span>
            <button onClick={() => setError("")} style={{ background: "none", border: "none", color: "#991B1B", cursor: "pointer", fontSize: 18, padding: 0, lineHeight: 1 }}>×</button>
          </div>
        )}

        {/* Meta summary */}
        <div style={{ marginTop: 56, paddingBottom: 32, borderBottom: "1px solid var(--border)", display: "flex", gap: 32, fontSize: 14, color: "var(--muted)", letterSpacing: "-0.01em", flexWrap: "wrap" }}>
          <span>Total <span style={{ color: "var(--text)", fontWeight: 500 }}>{stats.total}</span></span>
          <span>Applied <span style={{ color: "var(--text)", fontWeight: 500 }}>{stats.APPLIED}</span></span>
          <span>Screening <span style={{ color: "var(--text)", fontWeight: 500 }}>{stats.SCREENING}</span></span>
          <span>Interview <span style={{ color: "var(--text)", fontWeight: 500 }}>{stats.INTERVIEW}</span></span>
          <span>Offer <span style={{ color: "var(--text)", fontWeight: 500 }}>{stats.OFFER}</span></span>
          <span>Rejected <span style={{ color: "var(--text)", fontWeight: 500 }}>{stats.REJECTED}</span></span>
        </div>

        {/* Primary CTA */}
        {!showAddForm && (
          <div style={{ marginTop: 40 }}>
            <button className="btn btnPill" onClick={() => setShowAddForm(true)} style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 14, fontWeight: 500, color: "var(--text)" }}>
              <span style={{ fontSize: 16, lineHeight: 1 }}>+</span>
              <span>Add application</span>
            </button>
          </div>
        )}

        {/* Add/Edit form */}
        {showAddForm && (
          <div className="card" style={{ marginTop: 40, padding: 40 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
              <h2 style={{ fontSize: 18, fontWeight: 500, margin: 0, letterSpacing: "-0.02em" }}>
                {editingId ? "Edit application" : "New application"}
              </h2>
              <button className="btn" onClick={cancelEdit} style={{ padding: "6px 12px", fontSize: 13, color: "var(--muted-2)" }} type="button">
                Cancel
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: "grid", gap: 24 }}>
             <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
  <div>
    <label className="label">Company</label>
    <input
      className="input"
      value={form.company_name}
      onChange={(e) =>
        setForm({ ...form, company_name: e.target.value })
      }
      placeholder="Company name"
      required
    />
  </div>

  <div>
    <label className="label">Role</label>
    <input
      className="input"
      value={form.role_title}
      onChange={(e) =>
        setForm({ ...form, role_title: e.target.value })
      }
      placeholder="Role title"
      required
    />
  </div>
</div>


              <div style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: 20 }}>
                <div>
                  <label className="label">Status</label>
                  <select className="select" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="label">Applied date</label>
                  <input className="input" type="date" value={form.applied_date} onChange={(e) => setForm({ ...form, applied_date: e.target.value })} required />
                </div>
              </div>

              <div>
                <label className="label">Notes</label>
                <textarea className="textarea" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Any additional notes..." />
              </div>

              <div>
                <button disabled={loading} className="btn btnPrimary" style={{ padding: "13px 28px", fontSize: 15, fontWeight: 500, opacity: loading ? 0.75 : 1 }}>
                  {loading ? "Saving..." : editingId ? "Save changes" : "Add application"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Filters */}
        <div style={{ marginTop: 48, display: "grid", gridTemplateColumns: "1fr 240px", gap: 16 }}>
          <input className="input" placeholder="Search applications..." value={query} onChange={(e) => setQuery(e.target.value)} />
          <select className="select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="ALL">All statuses</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        {/* List */}
        <div style={{ marginTop: 32 }}>
          {!loading && apps.length === 0 && filteredApps.length === 0 && (
            <div style={{ padding: "80px 40px", textAlign: "center", color: "var(--muted)" }}>
              <h3 style={{ fontSize: 18, fontWeight: 500, color: "var(--text)", margin: "0 0 8px 0" }}>No applications yet</h3>
              <p style={{ margin: "0 0 28px 0" }}>Start tracking your job applications</p>
              {!showAddForm && (
                <button className="btn btnPill" onClick={() => setShowAddForm(true)} style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 14, fontWeight: 500, color: "var(--text)" }}>
                  <span style={{ fontSize: 16, lineHeight: 1 }}>+</span>
                  <span>Add your first application</span>
                </button>
              )}
            </div>
          )}

          {!loading && apps.length > 0 && filteredApps.length === 0 && (
            <div style={{ padding: "64px 40px", textAlign: "center", color: "var(--muted)" }}>
              No applications match your filters
            </div>
          )}

          <div style={{ display: "grid", gap: 24 }}>
            {filteredApps.map((app) => (
              <ApplicationCard key={app.id} app={app} onEdit={startEdit} onDelete={handleDelete} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
