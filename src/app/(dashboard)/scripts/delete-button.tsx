"use client";

import { useTransition } from "react";
import { deleteScript } from "../studio/actions";

export default function DeleteButton({ id }: { id: string }) {
  const [pending, startTransition] = useTransition();
  return (
    <button
      className="btn btn-ghost text-xs"
      disabled={pending}
      onClick={() => {
        if (!confirm("Supprimer ce script ?")) return;
        startTransition(async () => {
          await deleteScript(id);
        });
      }}
    >
      {pending ? "..." : "Supprimer"}
    </button>
  );
}
