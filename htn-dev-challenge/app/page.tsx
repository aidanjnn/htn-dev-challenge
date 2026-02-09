import HeroSection from "@/components/HeroSection";
import Schedule from "@/components/Schedule";

/**
 * Home page layout:
 * 1. Full-screen hero / landing section
 * 2. "Events Schedule" section with the calendar grid
 *
 * The hero provides the initial visual impact on first visit.
 * Scrolling down (or clicking "Explore Schedule") reveals the calendar.
 */
export default function Home() {
  return (
    <>
      <HeroSection />

      <section id="schedule" className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <h2 className="mb-1 text-2xl font-bold text-white">
          Events Schedule
        </h2>
        <p className="mb-8 text-sm text-gray-400">
          Find out all the information you&apos;ll need to know about Hack the North!
        </p>
        <Schedule />
      </section>
    </>
  );
}
