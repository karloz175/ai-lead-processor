import { useState } from "react";
import { createLead } from "../api/leads";
import type { Lead, LeadCreate } from "../api/leads";

interface Props {
  onLeadCreated: (lead: Lead) => void;
}

const emptyForm: LeadCreate = { name: "", email: "", company: "", message: "" };

export default function LeadForm({ onLeadCreated }: Props) {
  const [form, setForm] = useState<LeadCreate>(emptyForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const lead = await createLead(form);
      onLeadCreated(lead);
      setForm(emptyForm);
      setOpen(false);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ marginBottom: "32px" }}>
      {!open ? (
        <button
          onClick={() => setOpen(true)}
          style={{
            backgroundColor: "#2c3e50",
            color: "#fff",
            border: "none",
            padding: "12px 24px",
            borderRadius: "8px",
            fontSize: "16px",
            cursor: "pointer",
          }}
        >
          + Add New Lead
        </button>
      ) : (
        <div style={{
          border: "2px solid #2c3e50",
          borderRadius: "8px",
          padding: "24px",
          backgroundColor: "#fff",
        }}>
          <h2 style={{ margin: "0 0 20px", color: "#2c3e50" }}>New Lead</h2>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "12px" }}>
              <label style={labelStyle}>Name *</label>
              <input name="name" value={form.name} onChange={handleChange} required style={inputStyle} />
            </div>
            <div style={{ marginBottom: "12px" }}>
              <label style={labelStyle}>Email *</label>
              <input name="email" type="email" value={form.email} onChange={handleChange} required style={inputStyle} />
            </div>
            <div style={{ marginBottom: "12px" }}>
              <label style={labelStyle}>Company</label>
              <input name="company" value={form.company} onChange={handleChange} style={inputStyle} />
            </div>
            <div style={{ marginBottom: "20px" }}>
              <label style={labelStyle}>Message *</label>
              <textarea name="message" value={form.message} onChange={handleChange} required rows={4} style={{ ...inputStyle, resize: "vertical" }} />
            </div>

            {error && <p style={{ color: "#e74c3c", marginBottom: "12px" }}>{error}</p>}

            <div style={{ display: "flex", gap: "12px" }}>
              <button type="submit" disabled={loading} style={{
                backgroundColor: loading ? "#95a5a6" : "#2c3e50",
                color: "#fff",
                border: "none",
                padding: "12px 24px",
                borderRadius: "8px",
                fontSize: "16px",
                cursor: loading ? "not-allowed" : "pointer",
              }}>
                {loading ? "Analyzing with AI..." : "Submit Lead"}
              </button>
              <button type="button" onClick={() => setOpen(false)} style={{
                backgroundColor: "transparent",
                color: "#666",
                border: "1px solid #ccc",
                padding: "12px 24px",
                borderRadius: "8px",
                fontSize: "16px",
                cursor: "pointer",
              }}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  display: "block",
  marginBottom: "4px",
  fontSize: "14px",
  color: "#666",
  fontWeight: "bold",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px",
  border: "1px solid #ddd",
  borderRadius: "6px",
  fontSize: "16px",
  boxSizing: "border-box",
};
