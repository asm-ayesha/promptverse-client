"use client";

import { BEARER_TOKEN_KEY } from "./auth-client";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

function getToken() {
  try {
    return localStorage.getItem(BEARER_TOKEN_KEY) || "";
  } catch (_) {
    return "";
  }
}

// Core fetch wrapper — attaches the bearer token and parses JSON.
export async function apiFetch(path, options = {}) {
  const token = getToken();
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  let data = null;
  const text = await res.text();
  if (text) {
    try {
      data = JSON.parse(text);
    } catch (_) {
      data = text;
    }
  }

  if (!res.ok) {
    const message =
      (data && data.message) || `Request failed (${res.status})`;
    throw new Error(message);
  }
  return data;
}

export const apiGet = (path) => apiFetch(path, { method: "GET" });

export const apiPost = (path, body) =>
  apiFetch(path, { method: "POST", body: JSON.stringify(body || {}) });

export const apiPatch = (path, body) =>
  apiFetch(path, { method: "PATCH", body: JSON.stringify(body || {}) });

export const apiDelete = (path) => apiFetch(path, { method: "DELETE" });

export { API_URL };
