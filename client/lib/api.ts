import { supabase } from "@/lib/supabase";

const base = import.meta.env.VITE_API_BASE ?? "";

async function authHeader() {
  try {
    if (!supabase) return {};
    const { data } = await supabase.auth.getSession();
    const token = data.session?.access_token;
    if (token) return { Authorization: `Bearer ${token}` };
  } catch (e) {
    // ignore
  }
  return {};
}

export async function getTimetable(versionId: string) {
  const headers = { "Content-Type": "application/json", ...(await authHeader()) };
  const res = await fetch(`${base}/timetable/${encodeURIComponent(versionId)}`, { headers });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function adjustTimetable(versionId: string, payload: any) {
  const headers = { "Content-Type": "application/json", ...(await authHeader()) };
  const res = await fetch(`${base}/timetable/${encodeURIComponent(versionId)}/adjust`, {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function runTimetable(payload: any) {
  const headers = { "Content-Type": "application/json", ...(await authHeader()) };
  const res = await fetch(`${base}/timetable/run`, {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function approveTimetable(versionId: string, selectionId: string) {
  const headers = { "Content-Type": "application/json", ...(await authHeader()) };
  const res = await fetch(`${base}/timetable/${encodeURIComponent(versionId)}/approve`, {
    method: "POST",
    headers,
    body: JSON.stringify({ selectionId }),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function getSuggestions(items: any[]) {
  const headers = { "Content-Type": "application/json", ...(await authHeader()) };
  const res = await fetch(`${base}/timetable/suggestions`, {
    method: "POST",
    headers,
    body: JSON.stringify({ items }),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
