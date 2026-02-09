import EventList from "@/components/EventList";

/**
 * Home page — renders the full event listing with search and filters.
 */
export default function Home() {
  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Events</h1>
        <p className="mt-1 text-zinc-500 dark:text-zinc-400">
          Browse all Hack the North events
        </p>
      </div>
      <EventList />
    </>
  );
}
