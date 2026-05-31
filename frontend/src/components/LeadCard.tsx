import { Link } from "react-router-dom";
import type { Lead } from "../api/leads";

interface Props {
  lead: Lead;
}

export default function LeadCard({ lead }: Props) {
  const isHot = lead.classification === "hot";

  return (
    <Link to={`/leads/${lead.id}`} style={{ textDecoration: "none" }}>
      <div style={{
        border: `2px solid ${isHot ? "#e74c3c" : "#3498db"}`,
        borderRadius: "8px",
        padding: "16px",
        marginBottom: "12px",
        backgroundColor: "#fff",
        cursor: "pointer",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h3 style={{ margin: 0, color: "#2c3e50" }}>{lead.name}</h3>
            <p style={{ margin: "4px 0", color: "#666", fontSize: "14px" }}>{lead.email}</p>
            {lead.company && (
              <p style={{ margin: "4px 0", color: "#666", fontSize: "14px" }}>{lead.company}</p>
            )}
          </div>
          <div style={{ textAlign: "center" }}>
            <span style={{
              display: "inline-block",
              padding: "4px 12px",
              borderRadius: "20px",
              backgroundColor: isHot ? "#e74c3c" : "#3498db",
              color: "#fff",
              fontSize: "14px",
              fontWeight: "bold",
              textTransform: "uppercase",
            }}>
              {lead.classification ?? "pending"}
            </span>
            {lead.score !== null && (
              <p style={{ margin: "8px 0 0", fontWeight: "bold", color: "#2c3e50" }}>
                Score: {lead.score}/10
              </p>
            )}
          </div>
        </div>
        <p style={{ margin: "12px 0 0", color: "#444", fontSize: "14px" }}>
          {lead.message.length > 100 ? lead.message.slice(0, 100) + "..." : lead.message}
        </p>
      </div>
    </Link>
  );
}
