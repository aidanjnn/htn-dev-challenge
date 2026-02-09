"use client";

/**
 * Full-screen hero / landing section.
 *
 * - Flat #252525 background (inherits from body — no gradients)
 * - Large event title, date, tagline
 * - "Explore Schedule" CTA smooth-scrolls to the calendar below
 * - Subtle decorative glow for visual interest (does not change bg colour)
 */
export default function HeroSection() {
  return (
    <section className="relative flex min-h-screen flex-col items-start justify-center px-6 sm:px-12 lg:px-24">
      {/* Decorative glow — purely visual, doesn't alter the background colour */}
      <div
        className="pointer-events-none absolute right-10 top-1/3 h-72 w-72 rounded-full opacity-10 blur-3xl"
        style={{ background: "radial-gradient(circle, #7dd3fc, transparent)" }}
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-2xl">
        <p className="mb-4 text-sm font-medium tracking-widest uppercase text-gray-400 sm:text-base">
          January 2021 | Virtual Event
        </p>

        <h1 className="mb-6 text-5xl font-extrabold leading-tight tracking-tight text-white sm:text-7xl">
          Hack the
          <br />
          North
        </h1>

        <p className="mb-8 max-w-md text-lg text-gray-400 sm:text-xl">
          Browse the full event schedule. Log in to unlock private workshops and
          activities.
        </p>

        <a
          href="#schedule"
          className="inline-block rounded-full bg-[var(--accent)] px-8 py-3 text-sm font-semibold text-[#252525] transition-all hover:brightness-110"
        >
          Explore Schedule
        </a>
      </div>
    </section>
  );
}
