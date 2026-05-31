const API_URL = "http://localhost:8000";

export type Lead = {
  id: number;
  name: string;
  email: string;
  company: string | null;
  message: string;
  classification: string | null;
  score: number | null;
  ai_reason: string | null;
  created_at: string;
}

export async function fetchLeads(): Promise<Lead[]> {
  const response = await fetch(`${API_URL}/leads/`);
  if (!response.ok) throw new Error("Failed to fetch leads");
  return response.json();
}

export async function fetchLead(id: number): Promise<Lead> {
  const response = await fetch(`${API_URL}/leads/${id}`);
  if (!response.ok) throw new Error("Lead not found");
  return response.json();
}

export type LeadCreate = {
  name: string;
  email: string;
  company?: string;
  message: string;
}

export async function createLead(data: LeadCreate): Promise<Lead> {
  const response = await fetch(`${API_URL}/leads/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail?.[0]?.msg ?? "Failed to create lead");
  }
  return response.json();
}
