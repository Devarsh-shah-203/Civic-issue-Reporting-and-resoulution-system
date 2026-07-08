"use client";

import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import ProfileForm from "../../components/Forms/ProfileForm";
import ConfirmModal from "../../components/Modal/ConfirmModal";

export default function ProfilePage() {
  const { logout } = useAuth();
  const [confirmLogout, setConfirmLogout] = useState(false);

  return (
    <div className="mx-auto max-w-xl">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold text-ink dark:text-surface-sunk">
          Your profile
        </h1>
        <button
          onClick={() => setConfirmLogout(true)}
          className="text-sm font-semibold text-urgent hover:underline"
        >
          Log out
        </button>
      </div>

      <ProfileForm />

      <ConfirmModal
        open={confirmLogout}
        title="Log out of CivicPulse?"
        message="You'll need to log back in to file or track reports."
        confirmLabel="Log out"
        danger
        onCancel={() => setConfirmLogout(false)}
        onConfirm={logout}
      />
    </div>
  );
}
