// src/components/ApplicationCard.jsx
const STATUS_STYLES = {
  APPLIED: { bg: "#F5F5F4", text: "#57534E" },
  SCREENING: { bg: "#FEF3C7", text: "#92400E" },
  INTERVIEW: { bg: "#DBEAFE", text: "#1E40AF" },
  OFFER: { bg: "#D1FAE5", text: "#065F46" },
  REJECTED: { bg: "#FEE2E2", text: "#991B1B" },
};

export default function ApplicationCard({ app, onEdit, onDelete }) {
  const style = STATUS_STYLES[app.status] || STATUS_STYLES.APPLIED;

  const date = app.applied_date
    ? new Date(app.applied_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    : "";

  return (
    <div
      className="card"
      style={{ padding: 32, transition: "border-color 0.2s ease" }}
      onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--border-strong)")}
      onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
        <div style={{ flex: 1 }}>
          <h3 style={{ fontSize: 17, fontWeight: 500, margin: "0 0 4px 0", letterSpacing: "-0.02em" }}>
            {app.company_name}
          </h3>
          <p style={{ fontSize: 15, color: "var(--muted-2)", margin: 0, letterSpacing: "-0.01em" }}>
            {app.role_title}
          </p>
        </div>

        <span className="badge" style={{ background: style.bg, color: style.text }}>
          {app.status}
        </span>
      </div>

      <div style={{ fontSize: 14, color: "var(--muted)", marginBottom: app.notes ? 20 : 24, letterSpacing: "-0.01em" }}>
        {date ? `Applied ${date}` : ""}
      </div>

      {app.notes && (
        <div
          style={{
            fontSize: 14,
            color: "var(--muted-2)",
            background: "var(--bg)",
            padding: "16px 18px",
            borderRadius: 6,
            marginBottom: 24,
            lineHeight: 1.6,
            letterSpacing: "-0.01em",
          }}
        >
          {app.notes}
        </div>
      )}

      <div style={{ display: "flex", gap: 12 }}>
        <button className="btn btnQuiet" onClick={() => onEdit(app)} type="button">
          Edit
        </button>
        <button
          className="btn btnQuiet"
          onClick={() => onDelete(app.id)}
          type="button"
          style={{ color: "#78716C" }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "#FCA5A5";
            e.currentTarget.style.color = "#DC2626";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "var(--border)";
            e.currentTarget.style.color = "#78716C";
          }}
        >
          Delete
        </button>
      </div>
    </div>
  );
}
