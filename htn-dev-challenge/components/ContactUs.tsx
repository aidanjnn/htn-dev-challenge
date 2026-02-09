"use client";

/**
 * Contact methods — add or swap entries to update the section.
 */
const CONTACTS = [
  {
    label: "Email",
    value: "hello@hackathonglobal.com",
    href: "mailto:hello@hackathonglobal.com",
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
      </svg>
    ),
  },
  {
    label: "Instagram",
    value: "@hackathonglobal",
    href: "https://instagram.com",
    icon: (
      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    value: "Hackathon Global Inc.™",
    href: "https://linkedin.com",
    icon: (
      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
];

/**
 * Contact Us section — displays contact methods as clickable cards.
 *
 * Each card links to the relevant platform. Easy to extend by adding
 * entries to the CONTACTS array above.
 */
export default function ContactUs() {
  return (
    <section id="contact" className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h2 className="mb-2 text-2xl font-bold text-white">Contact Us</h2>
      <p className="mb-8 text-sm text-gray-400">
        Have questions or want to get involved? Reach out through any of these
        channels.
      </p>

      <div className="grid gap-4 sm:grid-cols-3">
        {CONTACTS.map((c) => (
          <a
            key={c.label}
            href={c.href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-3 rounded-xl border border-white/8 bg-white/[0.02] p-6 text-center transition-all hover:border-white/15 hover:bg-white/[0.04]"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white/70">
              {c.icon}
            </div>
            <div>
              <p className="text-sm font-medium text-white">{c.label}</p>
              <p className="text-xs text-gray-400">{c.value}</p>
            </div>
          </a>
        ))}
      </div>

      {/* Footer note */}
      <p className="mt-12 text-center text-xs text-gray-500">
        Built with Next.js, Tailwind CSS, and the Hackathon Global Inc.™ API.
      </p>
    </section>
  );
}
