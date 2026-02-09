/**
 * Represents a speaker at an event.
 */
export interface Speaker {
  name: string;
}

/**
 * The three categories an event can belong to.
 * Extensible — add new types here and the rest of the app adapts automatically.
 */
export type EventType = "workshop" | "tech_talk" | "activity";

/**
 * Controls visibility: "public" events are visible to everyone,
 * "private" events require authentication.
 */
export type Permission = "public" | "private";

/**
 * Shape of a single event returned by the HTN API.
 */
export interface HTNEvent {
  id: number;
  name: string;
  event_type: EventType;
  permission: Permission;
  start_time: number; // Unix timestamp in milliseconds
  end_time: number;
  description: string;
  speakers: Speaker[];
  public_url: string;
  private_url: string;
  related_events: number[];
}
