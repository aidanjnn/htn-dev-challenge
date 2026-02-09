"use client";

import { useEffect, useState, useMemo } from "react";
import { HTNEvent, EventType } from "@/types/event";
import { useAuth } from "@/context/AuthContext";
import { fetchEvents } from "@/lib/api";
import { formatEventType } from "@/lib/utils";
import EventCard from "./EventCard";

/** All known event types — add new ones here to make them filterable. */
const EVENT_TYPES: EventType[] = ["workshop", "tech_talk", "activity"];

/**
 * Main event listing component.
 * - Fetches events from the API on mount
 * - Sorts by start_time
 * - Filters out private events when not logged in
 * - Supports search by name/description and filtering by event type
 */
export default function EventList() {
  const { isLoggedIn } = useAuth();
  const [events, setEvents] = useState<HTNEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<EventType | "all">("all");

  useEffect(() => {
    fetchEvents()
      .then((data) => {
        // Sort by start_time ascending once on fetch
        data.sort((a, b) => a.start_time - b.start_time);
        setEvents(data);
      })
      .catch(() => setError("Failed to load events. Please try again later."))
      .finally(() => setLoading(false));
  }, []);

  // Derive filtered events from the full list whenever filters change
  const filteredEvents = useMemo(() => {
    let result = events;

    // Hide private events for unauthenticated users
    if (!isLoggedIn) {
      result = result.filter((e) => e.permission === "public");
    }

    // Filter by event type
    if (typeFilter !== "all") {
      result = result.filter((e) => e.event_type === typeFilter);
    }

    // Search by name or description (case-insensitive)
    if (search.trim()) {
      const query = search.toLowerCase();
      result = result.filter(
        (e) =>
          e.name.toLowerCase().includes(query) ||
          e.description.toLowerCase().includes(query)
      );
    }

    return result;
  }, [events, isLoggedIn, typeFilter, search]);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-300 border-t-blue-600" role="status">
          <span className="sr-only">Loading events...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-center text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400" role="alert">
        {error}
      </div>
    );
  }

  return (
    <div>
      {/* Search and filter controls */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row">
        {/* Search input */}
        <div className="relative flex-1">
          <label htmlFor="event-search" className="sr-only">
            Search events
          </label>
          <input
            id="event-search"
            type="text"
            placeholder="Search events..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-zinc-300 py-2 pl-10 pr-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-700 dark:bg-zinc-800"
          />
          {/* Search icon */}
          <svg
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        {/* Type filter dropdown */}
        <div>
          <label htmlFor="type-filter" className="sr-only">
            Filter by event type
          </label>
          <select
            id="type-filter"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as EventType | "all")}
            className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-700 dark:bg-zinc-800 sm:w-auto"
          >
            <option value="all">All Types</option>
            {EVENT_TYPES.map((type) => (
              <option key={type} value={type}>
                {formatEventType(type)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Results count */}
      <p className="mb-4 text-sm text-zinc-500 dark:text-zinc-400">
        {filteredEvents.length} event{filteredEvents.length !== 1 ? "s" : ""}
        {!isLoggedIn && " (log in to see private events)"}
      </p>

      {/* Event grid */}
      {filteredEvents.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      ) : (
        <p className="py-12 text-center text-zinc-500 dark:text-zinc-400">
          No events match your search.
        </p>
      )}
    </div>
  );
}
