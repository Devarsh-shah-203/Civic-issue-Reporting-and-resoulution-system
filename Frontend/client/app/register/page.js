import Link from "next/link";
import RegisterForm from "../../components/Forms/RegisterForm";

export default function RegisterPage() {
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
            Create your account
          </h1>
          <p className="mt-1 text-sm text-ink-muted">
            Report issues in your neighbourhood and follow them to resolution.
          </p>
          <div className="mt-6">
            <RegisterForm />
          </div>
        </div>

        <p className="mt-4 text-center text-sm text-ink-muted">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-civic-600 hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
