import Link from "next/link";
import LoginForm from "../../components/Forms/LoginForm";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <Link href="/" className="mb-8 flex items-center justify-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-civic-600 font-display text-sm font-bold text-white">
            CP
          </span>
          <span className="font-display text-xl font-semibold text-ink dark:text-surface-sunk">
            CivicPulse
          </span>
        </Link>

        <div className="ticket p-6 pl-8">
          <h1 className="font-display text-xl font-semibold text-ink dark:text-surface-sunk">
            Welcome back
          </h1>
          <p className="mt-1 text-sm text-ink-muted">
            Log in to track your reports and file new ones.
          </p>
          <div className="mt-6">
            <LoginForm />
          </div>
        </div>

        <p className="mt-4 text-center text-sm text-ink-muted">
          New here?{" "}
          <Link href="/register" className="font-semibold text-civic-600 hover:underline">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
