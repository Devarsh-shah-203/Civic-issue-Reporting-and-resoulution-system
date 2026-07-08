import ReportForm from "../../components/Forms/ReportForm";

export default function ReportPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="font-display text-2xl font-semibold text-ink dark:text-surface-sunk">
        Report a civic issue
      </h1>
      <p className="mt-1 text-sm text-ink-muted">
        Be specific about location — it&apos;s the difference between a fix in
        days versus months.
      </p>

      <div className="ticket mt-6 p-6 pl-8">
        <ReportForm />
      </div>
    </div>
  );
}
