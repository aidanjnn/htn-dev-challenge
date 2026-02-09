"use client";

import { useState } from "react";

/**
 * FAQ data — add, remove, or reorder items here.
 * The component renders them automatically.
 */
const FAQ_ITEMS = [
  {
    question: "What is Hackathon Global Inc.™?",
    answer:
      "Hackathon Global Inc.™ is a hackathon where students come together to build creative projects, attend workshops, and connect with industry professionals over the course of a weekend.",
  },
  {
    question: "Who can attend?",
    answer:
      "Anyone with an interest in technology and building things! Whether you're a beginner or experienced, there's something for everyone.",
  },
  {
    question: "How do I access private events?",
    answer:
      'Click "Visit Portal" in the navigation bar and log in with your credentials. Once authenticated, all private workshops and activities will be unlocked in the schedule.',
  },
  {
    question: "What types of events are there?",
    answer:
      "Events are split into three categories: Workshops (hands-on learning), Tech Talks (presentations and demos), and Activities (social and fun events).",
  },
  {
    question: "Is there a cost to attend?",
    answer:
      "No! Hackathon Global Inc.™ is completely free for all participants. We provide the venue, food, and swag.",
  },
];

/**
 * Frequently Asked Questions section with an accordion UI.
 *
 * Each item expands/collapses on click. Only one item is open at a time
 * (clicking a new one closes the previous). Accessible via button + aria
 * attributes.
 */
export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  function toggle(index: number) {
    setOpenIndex(openIndex === index ? null : index);
  }

  return (
    <section id="faq" className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h2 className="mb-2 text-2xl font-bold text-white">
        Frequently Asked Questions
      </h2>
      <p className="mb-8 text-sm text-gray-400">
        Everything you need to know before the event.
      </p>

      <div className="flex flex-col gap-2">
        {FAQ_ITEMS.map((item, i) => {
          const isOpen = openIndex === i;
          return (
            <div
              key={i}
              className="rounded-xl border border-white/8 bg-white/[0.02] transition-colors"
            >
              <button
                onClick={() => toggle(i)}
                className="flex w-full items-center justify-between px-5 py-4 text-left"
                aria-expanded={isOpen}
              >
                <span className="pr-4 text-sm font-medium text-white">
                  {item.question}
                </span>
                {/* Chevron rotates when open */}
                <svg
                  className={`h-4 w-4 shrink-0 text-gray-400 transition-transform duration-200 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {/* Collapsible answer — animated with grid-rows trick */}
              <div
                className="grid transition-[grid-template-rows] duration-200"
                style={{
                  gridTemplateRows: isOpen ? "1fr" : "0fr",
                }}
              >
                <div className="overflow-hidden">
                  <p className="px-5 pb-4 text-sm leading-relaxed text-gray-400">
                    {item.answer}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
