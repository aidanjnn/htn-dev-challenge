import { HTNEvent } from "@/types/event";

const API_URL = "https://api.hackthenorth.com/v3/events";

/**
 * Fetches all events from the HTN API.
 * Throws on network errors so callers can handle failure gracefully.
 */
export async function fetchEvents(): Promise<HTNEvent[]> {
  const res = await fetch(API_URL);
  if (!res.ok) {
    throw new Error(`Failed to fetch events: ${res.status}`);
  }
  return res.json();
}
