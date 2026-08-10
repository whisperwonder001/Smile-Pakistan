"use client";

import { useState, useTransition } from "react";
import { Plus, Trash2, ShieldCheck } from "lucide-react";
import { createRole, deleteRole, toggleRolePermission } from "./actions";

type Permission = { id: string; key: string; label: string };
type Role = {
  id: string;
  name: string;
  description: string | null;
  permissions: { permission: Permission }[];
};

export function NewRoleForm() {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const form = e.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") || "").trim();
    const description = String(data.get("description") || "").trim();
    if (!name) {
      setError("Role name is required.");
      return;
    }

    startTransition(async () => {
      try {
        await createRole({ name, description: description || undefined });
        setOpen(false);
        form.reset();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong.");
      }
    });
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-primary to-secondary px-5 py-2.5 text-sm font-semibold text-white"
      >
        <Plus className="h-4 w-4" />
        New Role
      </button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-4 space-y-3 rounded-2xl border border-slate-100 bg-white p-5 sm:max-w-md"
    >
      <input
        name="name"
        placeholder="Role name (e.g. Billing Clerk)"
        required
        className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-primary"
      />
      <input
        name="description"
        placeholder="Short description (optional)"
        className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-primary"
      />
      {error && <p className="text-xs text-red-600">{error}</p>}
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={isPending}
          className="rounded-full bg-gradient-to-r from-primary to-secondary px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
        >
          {isPending ? "Saving…" : "Save Role"}
        </button>
        <button
          type="button"
          onClick={() => {
            setOpen(false);
            setError(null);
          }}
          className="rounded-full px-5 py-2.5 text-sm font-semibold text-muted hover:bg-slate-100"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

export function RolePermissionsList({
  roles,
  permissions,
}: {
  roles: Role[];
  permissions: Permission[];
}) {
  const [expandedId, setExpandedId] = useState<string | null>(roles[0]?.id ?? null);

  return (
    <div className="mt-6 space-y-3">
      {roles.map((role) => (
        <RoleCard
          key={role.id}
          role={role}
          allPermissions={permissions}
          expanded={expandedId === role.id}
          onToggleExpand={() => setExpandedId(expandedId === role.id ? null : role.id)}
        />
      ))}
      {roles.length === 0 && <p className="text-sm text-muted">No roles yet.</p>}
    </div>
  );
}

function RoleCard({
  role,
  allPermissions,
  expanded,
  onToggleExpand,
}: {
  role: Role;
  allPermissions: Permission[];
  expanded: boolean;
  onToggleExpand: () => void;
}) {
  const [isPending, startTransition] = useTransition();
  const [deletePending, startDeleteTransition] = useTransition();
  const grantedIds = new Set(role.permissions.map((rp) => rp.permission.id));

  function handleToggle(permissionId: string, currentlyGranted: boolean) {
    startTransition(() => toggleRolePermission(role.id, permissionId, !currentlyGranted));
  }

  function handleDelete() {
    if (!confirm(`Delete the "${role.name}" role? This can't be undone.`)) return;
    startDeleteTransition(() => deleteRole(role.id));
  }

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-5">
      <div className="flex items-start justify-between gap-3">
        <button onClick={onToggleExpand} className="flex flex-1 items-start gap-3 text-left">
          <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary/15 to-secondary/15 text-primary-dark">
            <ShieldCheck className="h-4 w-4" />
          </span>
          <div>
            <p className="font-display text-sm font-bold text-text">{role.name}</p>
            {role.description && <p className="mt-0.5 text-xs text-muted">{role.description}</p>}
            <p className="mt-1 text-xs text-primary-dark">
              {grantedIds.size} of {allPermissions.length} permissions granted
            </p>
          </div>
        </button>
        <button
          onClick={handleDelete}
          disabled={deletePending}
          className="rounded-full border border-danger/20 p-2 text-danger hover:bg-danger/5 disabled:opacity-50"
          title="Delete role"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>

      {expanded && (
        <div className="mt-4 grid gap-2 border-t border-slate-100 pt-4 sm:grid-cols-2">
          {allPermissions.map((perm) => {
            const granted = grantedIds.has(perm.id);
            return (
              <label
                key={perm.id}
                className="flex cursor-pointer items-start gap-2.5 rounded-xl px-2.5 py-1.5 text-sm hover:bg-slate-50"
              >
                <input
                  type="checkbox"
                  checked={granted}
                  disabled={isPending}
                  onChange={() => handleToggle(perm.id, granted)}
                  className="mt-0.5 h-4 w-4 rounded border-slate-300 accent-primary"
                />
                <span className={granted ? "text-text" : "text-muted"}>{perm.label}</span>
              </label>
            );
          })}
          {allPermissions.length === 0 && (
            <p className="text-xs text-muted">No permissions defined yet.</p>
          )}
        </div>
      )}
    </div>
  );
}
