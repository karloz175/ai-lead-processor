import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchLead } from "../api/leads";
import type { Lead } from "../api/leads";

export default function LeadDetail() {
  const { id } = useParams<{ id: string }>();
  const [lead, setLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchLead(Number(id))
      .then(setLead)
      .catch(() => setError("Lead not found."))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p style={{ padding: "32px" }}>Loading...</p>;
  if (error) return <p style={{ padding: "32px", color: "red" }}>{error}</p>;
  if (!lead) return null;

  const isHot = lead.classification === "hot";

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "32px 16px" }}>
      <Link to="/" style={{ color: "#666", textDecoration: "none", fontSize: "14px" }}>
        ← Back to all leads
      </Link>

      <div style={{
        marginTop: "24px",
        border: `2px solid ${isHot ? "#e74c3c" : "#3498db"}`,
        borderRadius: "8px",
        padding: "24px",
        backgroundColor: "#fff",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <h1 style={{ margin: 0, color: "#2c3e50" }}>{lead.name}</h1>
            <p style={{ margin: "4px 0", color: "#666" }}>{lead.email}</p>
            {lead.company && <p style={{ margin: "4px 0", color: "#666" }}>{lead.company}</p>}
          </div>
          <span style={{
            padding: "6px 16px",
            borderRadius: "20px",
            backgroundColor: isHot ? "#e74c3c" : "#3498db",
            color: "#fff",
            fontWeight: "bold",
            textTransform: "uppercase",
          }}>
            {lead.classification ?? "pending"}
          </span>
        </div>

        <hr style={{ margin: "24px 0", borderColor: "#eee" }} />

        <section style={{ marginBottom: "24px" }}>
          <h3 style={{ color: "#666", fontSize: "12px", textTransform: "uppercase", marginBottom: "8px" }}>
            Message
          </h3>
          <p style={{ color: "#2c3e50", lineHeight: "1.6" }}>{lead.message}</p>
        </section>

        <section style={{ marginBottom: "24px" }}>
          <h3 style={{ color: "#666", fontSize: "12px", textTransform: "uppercase", marginBottom: "8px" }}>
            AI Analysis
          </h3>
          <p style={{ fontSize: "32px", fontWeight: "bold", color: "#2c3e50", margin: "0 0 8px" }}>
            {lead.score}/10
          </p>
          <p style={{ color: "#444", lineHeight: "1.6" }}>{lead.ai_reason}</p>
        </section>

        <section>
          <h3 style={{ color: "#666", fontSize: "12px", textTransform: "uppercase", marginBottom: "8px" }}>
            Received
          </h3>
          <p style={{ color: "#666" }}>
            {new Date(lead.created_at).toLocaleString()}
          </p>
        </section>
      </div>
    </div>
  );
}
