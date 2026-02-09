import HeroSection from "@/components/HeroSection";
import Schedule from "@/components/Schedule";
import FAQ from "@/components/FAQ";
import ContactUs from "@/components/ContactUs";

/**
 * Home page layout:
 * 1. Full-screen hero with typewriter title
 * 2. Events Schedule (calendar grid)
 * 3. Frequently Asked Questions (accordion)
 * 4. Contact Us (cards)
 *
 * Each section has an id anchor so the navbar links scroll to it.
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
          Find out all the information you&apos;ll need to know about Hackathon Global Inc.™!
        </p>
        <Schedule />
      </section>

      <FAQ />
      <ContactUs />
    </>
  );
}
