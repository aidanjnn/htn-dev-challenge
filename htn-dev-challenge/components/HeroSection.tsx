"use client";

import Typewriter from "./Typewriter";

/**
 * Full-screen hero / landing section.
 *
 * Features:
 * - Animated gradient background with subtle color shifts
 * - Gradient text on title
 * - Staggered fade-in-up animations for content
 * - Interactive button with glow effect
 * - Animated gradient orb for visual interest
 */
export default function HeroSection() {
  return (
    <section className="animated-gradient-bg relative flex min-h-screen flex-col items-start justify-center px-6 sm:px-12 lg:px-24 overflow-hidden">
      {/* Animated gradient orb */}
      <div
        className="pointer-events-none absolute right-10 top-1/4 sm:right-20 lg:right-32 animated-orb"
        aria-hidden="true"
      >
        <div className="animated-orb-inner relative h-64 w-64 sm:h-80 sm:w-80 lg:h-96 lg:w-96">
          {/* Outer glow ring */}
          <div
            className="absolute inset-0 rounded-full opacity-30 blur-xl"
            style={{
              background: 'linear-gradient(135deg, #7dd3fc, #a78bfa, #f472b6, #fb923c)'
            }}
          />
          {/* Main orb */}
          <div
            className="absolute inset-4 rounded-full"
            style={{
              background: 'conic-gradient(from 0deg, #7dd3fc, #a78bfa, #f472b6, #fb923c, #7dd3fc)',
              filter: 'blur(1px)'
            }}
          />
          {/* Inner core */}
          <div
            className="absolute inset-12 rounded-full bg-[#252525]/80 backdrop-blur-sm"
          />
          {/* Center glow */}
          <div
            className="absolute inset-16 rounded-full opacity-60"
            style={{
              background: 'radial-gradient(circle, #7dd3fc 0%, transparent 70%)'
            }}
          />
        </div>
      </div>

      <div className="relative z-10 max-w-2xl">
        <p className="fade-in-up fade-in-up-1 mb-4 text-sm font-medium tracking-widest uppercase text-gray-400 sm:text-base">
          January 2021 | better than hack___
        </p>

        <h1 className="fade-in-up fade-in-up-2 mb-6 text-5xl font-extrabold leading-tight tracking-tight sm:text-7xl">
          <span className="gradient-text">
            <Typewriter text="Hackathon Global Inc.™" speed={100} startDelay={400} />
          </span>
        </h1>

        <p className="fade-in-up fade-in-up-3 mb-8 max-w-md text-lg text-gray-400 sm:text-xl">
          git commit -m "change the world"
        </p>

        <a
          href="#schedule"
          className="fade-in-up fade-in-up-4 btn-glow inline-block rounded-full bg-[var(--accent)] px-8 py-3 text-sm font-semibold text-[#252525] hover:bg-[var(--accent-hover)]"
        >
          Explore Schedule
        </a>
      </div>
    </section>
  );
}

