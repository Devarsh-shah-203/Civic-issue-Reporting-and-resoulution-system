export default function Footer() {
  return (
    <footer className="border-t border-surface-border py-6 dark:border-darksurface-border">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 text-xs text-ink-muted sm:flex-row">
        <p>© {new Date().getFullYear()} CivicPulse — Crowdsourced civic issue reporting.</p>
        <p>Built for the Smart India Hackathon.</p>
      </div>
    </footer>
  );
}
