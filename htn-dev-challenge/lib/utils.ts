import { EventType } from "@/types/event";

/** Emoji icons for each event type */
const EVENT_ICONS: Record<EventType, string> = {
  tech_talk: "🎤",
  workshop: "🛠️",
  activity: "🎮",
};

/**
 * Converts an event_type slug into a human-readable label with icon.
 * E.g. "tech_talk" -> "🎤 Tech Talk"
 */
export function formatEventType(type: EventType): string {
  const icon = EVENT_ICONS[type] || "";
  const label = type
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
  return `${icon} ${label}`;
}

/**
 * Formats a Unix-ms timestamp into a readable date/time string.
 */
export function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}
