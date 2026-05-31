import { useEffect, useState } from "react";
import { fetchLeads } from "../api/leads";
import type { Lead } from "../api/leads";
import LeadCard from "../components/LeadCard";
import LeadForm from "../components/LeadForm";

export default function LeadList() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchLeads()
      .then(setLeads)
      .catch(() => setError("Could not load leads. Is the backend running?"))
      .finally(() => setLoading(false));
  }, []);

  function handleLeadCreated(newLead: Lead) {
    setLeads((prev) => [newLead, ...prev]);
  }

  if (loading) return <p style={{ padding: "32px" }}>Loading leads...</p>;
  if (error) return <p style={{ padding: "32px", color: "red" }}>{error}</p>;

  const hotLeads = leads.filter((l) => l.classification === "hot");
  const coldLeads = leads.filter((l) => l.classification === "cold");

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "32px 16px" }}>
      <h1 style={{ color: "#2c3e50", marginBottom: "8px" }}>AI Lead Processor</h1>
      <p style={{ color: "#666", marginBottom: "32px" }}>
        {leads.length} total leads · {hotLeads.length} hot · {coldLeads.length} cold
      </p>

      <LeadForm onLeadCreated={handleLeadCreated} />

      {leads.length === 0 ? (
        <p style={{ color: "#666" }}>No leads yet. Add one using the form above.</p>
      ) : (
        <>
          {hotLeads.length > 0 && (
            <section style={{ marginBottom: "32px" }}>
              <h2 style={{ color: "#e74c3c", marginBottom: "16px" }}>🔥 Hot Leads</h2>
              {hotLeads.map((lead) => (
                <LeadCard key={lead.id} lead={lead} />
              ))}
            </section>
          )}

          {coldLeads.length > 0 && (
            <section>
              <h2 style={{ color: "#3498db", marginBottom: "16px" }}>❄️ Cold Leads</h2>
              {coldLeads.map((lead) => (
                <LeadCard key={lead.id} lead={lead} />
              ))}
            </section>
          )}
        </>
      )}
    </div>
  );
}
