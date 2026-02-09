"use client";

import Link from "next/link";
import { HTNEvent } from "@/types/event";
import { formatEventType, formatDate } from "@/lib/utils";

interface EventCardProps {
  event: HTNEvent;
}

/** Color mapping for event type badges — easy to extend with new types. */
const TYPE_COLORS: Record<string, string> = {
  workshop: "bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300",
  tech_talk: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
  activity: "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300",
};

/**
 * Displays a single event as a card.
 * Links to the event detail page for full info + related events.
 */
export default function EventCard({ event }: EventCardProps) {
  const badgeColor = TYPE_COLORS[event.event_type] ?? "bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-300";

  return (
    <Link
      href={`/events/${event.id}`}
      className="group flex flex-col rounded-xl border border-zinc-200 bg-white p-5 transition-shadow hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900"
    >
      {/* Header: type badge + permission indicator */}
      <div className="mb-3 flex items-center gap-2">
        <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${badgeColor}`}>
          {formatEventType(event.event_type)}
        </span>
        {event.permission === "private" && (
          <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800 dark:bg-amber-900/40 dark:text-amber-300">
            Private
          </span>
        )}
      </div>

      {/* Title */}
      <h3 className="mb-1 text-lg font-semibold leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400">
        {event.name}
      </h3>

      {/* Date/time */}
      <p className="mb-2 text-sm text-zinc-500 dark:text-zinc-400">
        {formatDate(event.start_time)}
      </p>

      {/* Speakers */}
      {event.speakers.length > 0 && (
        <p className="mb-3 text-sm text-zinc-600 dark:text-zinc-400">
          <span className="font-medium">Speakers:</span>{" "}
          {event.speakers.map((s) => s.name).join(", ")}
        </p>
      )}

      {/* Description preview (first 120 chars) */}
      {event.description && (
        <p className="line-clamp-2 text-sm text-zinc-600 dark:text-zinc-400">
          {event.description}
        </p>
      )}
    </Link>
  );
}
