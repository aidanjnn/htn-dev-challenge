"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { HTNEvent, EventType } from "@/types/event";
import { useAuth } from "@/context/AuthContext";
import { fetchEvents } from "@/lib/api";
import { formatEventType } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

/** Height in pixels of one hour row in the calendar grid. */
const HOUR_HEIGHT = 80;

/** All known event types — add new ones here to extend the filter pills. */
const EVENT_TYPES: EventType[] = ["workshop", "tech_talk", "activity"];

/** Background colours for event cards, keyed by event_type. */
const TYPE_COLORS: Record<string, string> = {
  workshop: "#4a6741",
  tech_talk: "#6b5b7b",
  activity: "#4a6d5a",
};

/** Bright border accent colors for left border, keyed by event_type. */
const TYPE_BORDER_COLORS: Record<string, string> = {
  workshop: "#22c55e",   // green
  tech_talk: "#a855f7",  // purple
  activity: "#3b82f6",   // blue
};

/* ------------------------------------------------------------------ */
/*  Helper functions                                                   */
/* ------------------------------------------------------------------ */

/**
 * Returns a date-only key string like "2021-01-12" for grouping events by day.
 */
function dateToDayKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

/**
 * Formats a day key into a column header like "Tue 1/12".
 */
function formatDayHeader(dayKey: string): string {
  const d = new Date(dayKey + "T12:00:00");
  const weekday = d.toLocaleDateString("en-US", { weekday: "short" });
  return `${weekday} ${d.getMonth() + 1}/${d.getDate()}`;
}

/**
 * Formats a timestamp into a short time (e.g. "4:00 AM").
 */
function formatTime(ts: number): string {
  return new Date(ts).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

/**
 * Returns the hour-of-day (0–23) for a timestamp.
 */
function getHour(ts: number): number {
  return new Date(ts).getHours();
}

/**
 * Returns the fractional hour offset (0–1) for the minutes within an hour.
 * e.g. 4:30 → 0.5
 */
function getMinuteFraction(ts: number): number {
  return new Date(ts).getMinutes() / 60;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

/**
 * Calendar grid schedule — matches the UofTHacks-style layout:
 *
 * Layout:
 *   ┌──────────┬──────────┬──────────┬──────────┐
 *   │  (hours) │  Day 1   │  Day 2   │  Day 3   │
 *   ├──────────┼──────────┼──────────┼──────────┤
 *   │  12am    │          │ ████████ │          │
 *   │  1am     │          │          │ ████████ │
 *   │  ...     │          │          │          │
 *   └──────────┴──────────┴──────────┴──────────┘
 *
 * - Day columns side-by-side
 * - Hour rows from the earliest to the latest hour across all events
 * - Event cards absolutely positioned inside each day column based on
 *   start_time (top offset) and duration (height)
 * - Private events appear blurred with a lock overlay when not logged in
 * - Filter pills + search bar above the grid
 */
export default function Schedule() {
  const { isLoggedIn } = useAuth();
  const [events, setEvents] = useState<HTNEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<EventType | "all">("all");
  const [viewMode, setViewMode] = useState<"calendar" | "list">("calendar");
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);

  // Fetch events once on mount, sort by start_time
  useEffect(() => {
    fetchEvents()
      .then((data) => {
        data.sort((a, b) => a.start_time - b.start_time);
        setEvents(data);
      })
      .catch(() => setError("Failed to load events. Please try again later."))
      .finally(() => setLoading(false));
  }, []);

  // Apply filters (search + type). Private events are always shown in the
  // grid but blurred when not logged in.
  const filteredEvents = useMemo(() => {
    let result = events;

    if (typeFilter !== "all") {
      result = result.filter((e) => e.event_type === typeFilter);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (e) =>
          e.name.toLowerCase().includes(q) ||
          e.description?.toLowerCase().includes(q)
      );
    }

    return result;
  }, [events, typeFilter, search]);

  // Group filtered events by day
  const dayGroups = useMemo(() => {
    const map = new Map<string, HTNEvent[]>();
    for (const evt of filteredEvents) {
      const key = dateToDayKey(new Date(evt.start_time));
      const arr = map.get(key) ?? [];
      arr.push(evt);
      map.set(key, arr);
    }
    return map;
  }, [filteredEvents]);

  const dayKeys = useMemo(
    () => Array.from(dayGroups.keys()).sort(),
    [dayGroups]
  );

  // Compute the hour range the grid needs to cover
  const { minHour, maxHour } = useMemo(() => {
    if (filteredEvents.length === 0) return { minHour: 0, maxHour: 24 };
    let min = 23;
    let max = 0;
    for (const evt of filteredEvents) {
      min = Math.min(min, getHour(evt.start_time));
      max = Math.max(max, getHour(evt.end_time));
    }
    return { minHour: min, maxHour: Math.min(max + 1, 24) };
  }, [filteredEvents]);

  const totalHours = maxHour - minHour;

  // Build hour labels array
  const hourLabels = useMemo(() => {
    const labels: string[] = [];
    for (let h = minHour; h < maxHour; h++) {
      const ampm = h === 0 ? "12am" : h < 12 ? `${h}am` : h === 12 ? "12pm" : `${h - 12}pm`;
      labels.push(ampm);
    }
    return labels;
  }, [minHour, maxHour]);

  // Date range label (e.g. "Jan 12 – 13, 2021")
  const dateRangeLabel = useMemo(() => {
    if (dayKeys.length === 0) return "";
    const first = new Date(dayKeys[0] + "T12:00:00");
    const last = new Date(dayKeys[dayKeys.length - 1] + "T12:00:00");
    const month = first.toLocaleDateString("en-US", { month: "short" });
    if (first.getMonth() === last.getMonth()) {
      return `${month} ${first.getDate()} – ${last.getDate()}, ${first.getFullYear()}`;
    }
    const month2 = last.toLocaleDateString("en-US", { month: "short" });
    return `${month} ${first.getDate()} – ${month2} ${last.getDate()}, ${first.getFullYear()}`;
  }, [dayKeys]);

  /* ---------------------------------------------------------------- */
  /*  Render                                                           */
  /* ---------------------------------------------------------------- */

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-600 border-t-[var(--accent)]" role="status">
          <span className="sr-only">Loading schedule...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-800/50 bg-red-900/20 p-4 text-center text-red-400" role="alert">
        {error}
      </div>
    );
  }

  return (
    <div>
      {/* ── Filter pills ── */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium text-gray-400">Filters:</span>
          <button
            onClick={() => setTypeFilter("all")}
            className={`rounded-full border px-4 py-1 text-xs font-medium transition-all ${typeFilter === "all"
              ? "border-white/30 bg-white/10 text-white"
              : "border-white/10 text-gray-400 hover:border-white/20 hover:text-gray-200"
              }`}
          >
            All
          </button>
          {EVENT_TYPES.map((type) => (
            <button
              key={type}
              onClick={() => setTypeFilter(type)}
              className={`rounded-full border px-4 py-1 text-xs font-medium transition-all ${typeFilter === type
                ? "border-white/30 bg-white/10 text-white"
                : "border-white/10 text-gray-400 hover:border-white/20 hover:text-gray-200"
                }`}
            >
              {formatEventType(type)}
            </button>
          ))}
        </div>
        {/* View toggle */}
        <div className="flex items-center gap-1 rounded-full border border-white/10 p-1">
          <button
            onClick={() => setViewMode("calendar")}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${viewMode === "calendar"
              ? "bg-white/10 text-white"
              : "text-gray-400 hover:text-gray-200"
              }`}
            aria-label="Calendar view"
          >
            📅 Calendar
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${viewMode === "list"
              ? "bg-white/10 text-white"
              : "text-gray-400 hover:text-gray-200"
              }`}
            aria-label="List view"
          >
            📋 List
          </button>
        </div>
      </div>

      {/* ── Search bar ── */}
      <div className="relative mb-6 max-w-sm">
        <label htmlFor="schedule-search" className="sr-only">Search Events</label>
        <input
          id="schedule-search"
          type="text"
          placeholder="Search Events"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border border-white/10 bg-white/5 py-2 pl-4 pr-10 text-sm text-white placeholder-gray-500 outline-none transition-colors focus:border-[var(--accent)]"
        />
        <svg
          className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500"
          fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      {/* ── Date range heading ── */}
      {dateRangeLabel && (
        <p className="mb-4 text-center text-lg font-semibold text-white">
          {dateRangeLabel}
        </p>
      )}

      {/* ── Calendar grid ── */}
      {viewMode === "calendar" && dayKeys.length > 0 && (
        <div className="overflow-x-auto rounded-lg border border-white/8">
          <div
            className="grid"
            style={{
              /* First column = hour labels (60px), then equal-width day columns */
              gridTemplateColumns: `60px repeat(${dayKeys.length}, minmax(180px, 1fr))`,
            }}
          >
            {/* ── Header row: empty corner + day headers ── */}
            <div className="sticky top-0 z-10 border-b border-r border-white/8 bg-[#252525] p-2" />
            {dayKeys.map((dk) => (
              <div
                key={dk}
                className="sticky top-0 z-10 border-b border-r border-white/8 bg-[#252525] p-2 text-center text-sm font-semibold text-white last:border-r-0"
              >
                {formatDayHeader(dk)}
              </div>
            ))}

            {/* ── Body: hour labels + day columns ── */}
            {/* Hour label column */}
            <div className="border-r border-white/8">
              {hourLabels.map((label, i) => (
                <div
                  key={label}
                  className="flex items-start justify-end border-b border-white/8 pr-2 pt-1 text-xs text-gray-500"
                  style={{ height: HOUR_HEIGHT }}
                >
                  {label}
                </div>
              ))}
            </div>

            {/* One column per day */}
            {dayKeys.map((dk) => {
              const dayEvts = dayGroups.get(dk) ?? [];
              return (
                <div
                  key={dk}
                  className="relative border-r border-white/8 last:border-r-0"
                  style={{ height: totalHours * HOUR_HEIGHT }}
                >
                  {/* Hour grid lines */}
                  {hourLabels.map((_, i) => (
                    <div
                      key={i}
                      className="absolute left-0 right-0 border-b border-white/8"
                      style={{ top: i * HOUR_HEIGHT + HOUR_HEIGHT }}
                    />
                  ))}

                  {/* Event cards */}
                  {dayEvts.map((evt) => {
                    const startH = getHour(evt.start_time) - minHour + getMinuteFraction(evt.start_time);
                    const endH = getHour(evt.end_time) - minHour + getMinuteFraction(evt.end_time);
                    const durationH = Math.max(endH - startH, 0.5); // min half-hour visible
                    const top = startH * HOUR_HEIGHT;
                    const height = durationH * HOUR_HEIGHT;
                    const bg = TYPE_COLORS[evt.event_type] ?? "#3a4a5a";

                    const isPrivate = evt.permission === "private";
                    const isBlurred = isPrivate && !isLoggedIn;

                    return (
                      <div
                        key={evt.id}
                        className="absolute left-1 right-1 overflow-hidden rounded-md transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(0,0,0,0.3)] hover:z-10"
                        style={{ top, height, minHeight: 36 }}
                      >
                        {/* Card content with colorful left border */}
                        <Link
                          href={isBlurred ? "/login" : `/events/${evt.id}`}
                          className={`flex h-full flex-col justify-between p-2 pl-3 text-white transition-all hover:brightness-110 ${isBlurred ? "select-none blur-[6px]" : ""}`}
                          style={{
                            backgroundColor: bg,
                            borderLeft: `4px solid ${TYPE_BORDER_COLORS[evt.event_type] ?? "#60a5fa"}`,
                          }}
                          tabIndex={isBlurred ? -1 : undefined}
                          aria-label={isBlurred ? "Log in to view this private event" : evt.name}
                        >
                          <div>
                            <p className="text-xs font-semibold leading-tight">
                              {evt.name}
                            </p>
                            {/* Show brief description only on tall cards */}
                            {height > 100 && evt.description && (
                              <p className="mt-0.5 line-clamp-1 text-[10px] leading-tight text-white/60">
                                {evt.description.slice(0, 50)}...
                              </p>
                            )}
                          </div>
                          <div className="flex items-end justify-between">
                            <span className="text-[10px] text-white/60">
                              {formatTime(evt.start_time)} – {formatTime(evt.end_time)}
                            </span>
                            <span className="rounded-sm bg-white/10 px-1 py-0.5 text-[9px] text-white/60">
                              {evt.permission === "public" ? "Public" : "Private"}
                            </span>
                          </div>
                        </Link>

                        {/* Lock overlay for blurred private events */}
                        {isBlurred && (
                          <Link
                            href="/login"
                            className="absolute inset-0 flex items-center justify-center"
                            aria-label="Log in to view this private event"
                          >
                            <div className="flex flex-col items-center gap-0.5">
                              <svg className="h-5 w-5 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                              </svg>
                              <span className="text-[10px] font-medium text-pink-400">Log in</span>
                            </div>
                          </Link>
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── List view ── */}
      {viewMode === "list" && dayKeys.length > 0 && (
        <div>
          {/* Day navigation header */}
          <div className="mb-6 flex items-center justify-center rounded-xl bg-[#7dd3fc] py-4">
            <button
              onClick={() => setSelectedDayIndex(Math.max(0, selectedDayIndex - 1))}
              disabled={selectedDayIndex === 0}
              className="px-4 text-2xl font-bold text-[#252525] transition-opacity disabled:opacity-30"
              aria-label="Previous day"
            >
              ‹
            </button>
            <span className="px-8 text-xl font-bold text-[#252525]">
              {dayKeys[selectedDayIndex] ? new Date(dayKeys[selectedDayIndex] + "T12:00:00").toLocaleDateString("en-US", { weekday: "long" }) : ""}
            </span>
            <button
              onClick={() => setSelectedDayIndex(Math.min(dayKeys.length - 1, selectedDayIndex + 1))}
              disabled={selectedDayIndex === dayKeys.length - 1}
              className="px-4 text-2xl font-bold text-[#252525] transition-opacity disabled:opacity-30"
              aria-label="Next day"
            >
              ›
            </button>
          </div>

          {/* Event list */}
          <div className="space-y-4">
            {(dayGroups.get(dayKeys[selectedDayIndex]) ?? []).map((evt) => {
              const bg = TYPE_COLORS[evt.event_type] ?? "#3a4a5a";
              const borderColor = TYPE_BORDER_COLORS[evt.event_type] ?? "#60a5fa";
              const isPrivate = evt.permission === "private";
              const isBlurred = isPrivate && !isLoggedIn;

              return (
                <Link
                  key={evt.id}
                  href={isBlurred ? "/login" : `/events/${evt.id}`}
                  className={`block rounded-xl p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(0,0,0,0.3)] ${isBlurred ? "select-none blur-[6px]" : ""}`}
                  style={{
                    backgroundColor: bg,
                    borderLeft: `5px solid ${borderColor}`,
                  }}
                >
                  <div className="flex items-start justify-between">
                    <h3 className="text-lg font-bold text-white">{evt.name}</h3>
                    <button
                      className="text-pink-400 transition-colors hover:text-pink-300"
                      aria-label="Favorite event"
                      onClick={(e) => e.preventDefault()}
                    >
                      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </button>
                  </div>

                  <div className="mt-3 space-y-1 text-sm text-white/80">
                    <p>
                      <span className="text-pink-400">Time:</span>{" "}
                      {formatTime(evt.start_time)} - {formatTime(evt.end_time)}
                    </p>
                    {evt.speakers && evt.speakers.length > 0 && (
                      <p>
                        <span className="text-pink-400">Host:</span>{" "}
                        {evt.speakers.map((s) => s.name).join(", ")}
                      </p>
                    )}
                  </div>

                  <div className="mt-4 flex justify-end">
                    <span className="rounded-md border border-white/20 px-3 py-1 text-xs font-medium uppercase tracking-wider text-white/60">
                      View Details
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {dayKeys.length === 0 && (
        <p className="py-12 text-center text-gray-500">
          No events match your search.
        </p>
      )}
    </div>
  );
}
