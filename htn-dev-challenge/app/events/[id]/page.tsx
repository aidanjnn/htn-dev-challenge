"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { HTNEvent } from "@/types/event";
import { useAuth } from "@/context/AuthContext";
import { fetchEvents } from "@/lib/api";
import { formatEventType, formatDate } from "@/lib/utils";

/**
 * Event detail page — shows full info for a single event,
 * including its description, speakers, links, and related events.
 *
 * Private events redirect unauthenticated users back to the home page.
 */
export default function EventDetailPage() {
  const params = useParams();
  const { isLoggedIn } = useAuth();
  const [event, setEvent] = useState<HTNEvent | null>(null);
  const [relatedEvents, setRelatedEvents] = useState<HTNEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const id = Number(params.id);

    fetchEvents()
      .then((data) => {
        const found = data.find((e) => e.id === id);
        if (!found) {
          setNotFound(true);
          return;
        }
        setEvent(found);

        // Resolve related events by ID
        const related = found.related_events
          .map((rid) => data.find((e) => e.id === rid))
          .filter((e): e is HTNEvent => {
            if (!e) return false;
            // Only show related events the user has permission to see
            if (!isLoggedIn && e.permission === "private") return false;
            return true;
          });
        setRelatedEvents(related);
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [params.id, isLoggedIn]);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-300 border-t-blue-600" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  if (notFound || !event) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <h1 className="mb-4 text-2xl font-bold">Event Not Found</h1>
        <p className="mb-6 text-zinc-500 dark:text-zinc-400">
          This event doesn&apos;t exist or you don&apos;t have permission to view it.
        </p>
        <Link
          href="/"
          className="text-blue-600 hover:underline dark:text-blue-400"
        >
          Back to all events
        </Link>
      </div>
    );
  }

  // Block private events for unauthenticated users
  if (event.permission === "private" && !isLoggedIn) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <h1 className="mb-4 text-2xl font-bold">Private Event</h1>
        <p className="mb-6 text-zinc-500 dark:text-zinc-400">
          Please log in to view this event.
        </p>
        <Link
          href="/"
          className="text-blue-600 hover:underline dark:text-blue-400"
        >
          Back to all events
        </Link>
      </div>
    );
  }

  // Determine which URL to show
  const eventUrl = isLoggedIn && event.private_url ? event.private_url : event.public_url;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      {/* Back link */}
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
      >
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to all events
      </Link>

      {/* Event header */}
      <div className="mb-6">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span
            className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
              event.event_type === "workshop"
                ? "bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300"
                : event.event_type === "tech_talk"
                ? "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300"
                : "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300"
            }`}
          >
            {formatEventType(event.event_type)}
          </span>
          {event.permission === "private" && (
            <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800 dark:bg-amber-900/40 dark:text-amber-300">
              Private
            </span>
          )}
        </div>

        <h1 className="mb-2 text-3xl font-bold tracking-tight">{event.name}</h1>

        <p className="text-zinc-500 dark:text-zinc-400">
          {formatDate(event.start_time)} — {formatDate(event.end_time)}
        </p>
      </div>

      {/* Speakers */}
      {event.speakers.length > 0 && (
        <div className="mb-6">
          <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
            Speakers
          </h2>
          <div className="flex flex-wrap gap-2">
            {event.speakers.map((speaker, i) => (
              <span
                key={i}
                className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-1 text-sm dark:border-zinc-700 dark:bg-zinc-800"
              >
                {speaker.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Description */}
      {event.description && (
        <div className="mb-6">
          <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
            Description
          </h2>
          <p className="leading-relaxed text-zinc-700 dark:text-zinc-300">
            {event.description}
          </p>
        </div>
      )}

      {/* Event link */}
      {eventUrl && (
        <div className="mb-8">
          <a
            href={eventUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
          >
            View Event
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
      )}

      {/* Related events */}
      {relatedEvents.length > 0 && (
        <div>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
            Related Events
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {relatedEvents.map((related) => (
              <Link
                key={related.id}
                href={`/events/${related.id}`}
                className="rounded-lg border border-zinc-200 p-4 transition-shadow hover:shadow-md dark:border-zinc-800"
              >
                <p className="font-medium">{related.name}</p>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  {formatEventType(related.event_type)} · {formatDate(related.start_time)}
                </p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
