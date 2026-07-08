"use client";

import Link from "next/link";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import { COMPLAINT_CATEGORIES } from "../utils/constants";

const STEPS = [
  {
    n: "01",
    title: "Spot it",
    body: "See a pothole, a dead streetlight, or an overflowing bin? Open CivicPulse.",
  },
  {
    n: "02",
    title: "Pin it",
    body: "Drop an exact map pin, add a photo and a short description, and file it.",
  },
  {
    n: "03",
    title: "Track it",
    body: "Watch your ticket move from Pending → In Progress → Resolved in real time.",
  },
];

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1">
        <section className="mx-auto max-w-6xl px-4 pb-16 pt-16 sm:pt-24">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-civic-600">
                Municipal reporting, made visible
              </p>
              <h1 className="mt-3 font-display text-4xl font-bold leading-tight text-ink dark:text-surface-sunk sm:text-5xl">
                Every civic complaint deserves a paper trail.
              </h1>
              <p className="mt-4 max-w-md text-ink-muted">
                CivicPulse turns scattered phone calls and forgotten emails into
                tracked tickets — so citizens know what happened, and
                authorities know what&apos;s next.
              </p>
              <div className="mt-8 flex gap-3">
                <Link
                  href="/register"
                  className="rounded-md bg-civic-600 px-6 py-3 text-sm font-semibold text-white hover:bg-civic-700"
                >
                  Report your first issue
                </Link>
                <Link
                  href="/login"
                  className="rounded-md border border-surface-border px-6 py-3 text-sm font-semibold text-ink hover:bg-surface-sunk dark:border-darksurface-border dark:text-surface-sunk"
                >
                  Log in
                </Link>
              </div>
            </div>

            <div className="ticket p-6 pl-8">
              <p className="ticket-id">CP-2026-4821</p>
              <h3 className="mt-1 font-display text-lg font-semibold text-ink dark:text-surface-sunk">
                🕳️ Deep pothole near Malviya Circle
              </h3>
              <p className="mt-2 text-sm text-ink-muted">
                A large pothole has formed right at the intersection, causing
                two-wheelers to swerve dangerously during peak hours.
              </p>
              <div className="mt-4 flex items-center justify-between">
                <span className="stamp stamp-progress">In Progress</span>
                <span className="text-xs text-ink-muted">6 days ago</span>
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-surface-border bg-surface-sunk py-16 dark:border-darksurface-border dark:bg-darksurface-raised">
          <div className="mx-auto max-w-6xl px-4">
            <h2 className="font-display text-2xl font-semibold text-ink dark:text-surface-sunk">
              Three steps. One clear ticket.
            </h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-3">
              {STEPS.map((step) => (
                <div key={step.n} className="rounded-lg bg-surface p-6 shadow-card dark:bg-darksurface">
                  <p className="font-mono text-2xl font-bold text-civic-200">{step.n}</p>
                  <h3 className="mt-2 font-display text-lg font-semibold text-ink dark:text-surface-sunk">
                    {step.title}
                  </h3>
                  <p className="mt-1 text-sm text-ink-muted">{step.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-16">
          <h2 className="font-display text-2xl font-semibold text-ink dark:text-surface-sunk">
            What you can report
          </h2>
          <div className="mt-6 flex flex-wrap gap-3">
            {COMPLAINT_CATEGORIES.map((cat) => (
              <span
                key={cat.value}
                className="rounded-full border border-surface-border px-4 py-2 text-sm text-ink-muted dark:border-darksurface-border"
              >
                {cat.icon} {cat.label}
              </span>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
