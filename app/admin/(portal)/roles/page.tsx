import { redirect } from "next/navigation";
import { Reveal } from "@/components/ui/Reveal";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { NewRoleForm, RolePermissionsList } from "@/features/admin/RolePermissionsPanel";

export default async function AdminRolesPage() {
  const session = await auth();
  // Admin-only page — receptionists can see everything else in the admin
  // panel but not the controls that grant access.
  if (!session || session.user.role !== "ADMIN") {
    redirect("/admin/dashboard");
  }

  const [roles, permissions] = await Promise.all([
    prisma.role.findMany({
      include: { permissions: { include: { permission: true } } },
      orderBy: { name: "asc" },
    }),
    prisma.permission.findMany({ orderBy: { label: "asc" } }),
  ]);

  return (
    <div>
      <Reveal>
        <h1 className="font-display text-2xl font-extrabold text-text">Roles & Permissions</h1>
        <p className="mt-1 text-sm text-muted">
          {roles.length} roles, {permissions.length} permissions defined.
        </p>
      </Reveal>

      <div className="mt-4">
        <NewRoleForm />
      </div>

      <RolePermissionsList roles={roles} permissions={permissions} />

      <p className="mt-6 text-xs text-muted">
        This granular RBAC layer is separate from the fast-path role field
        (Patient / Doctor / Receptionist / Admin) that actually gates
        `/patient`, `/doctor`, and `/admin` routes today. Toggling
        permissions here updates the database but doesn't yet change what
        any individual user can do in the app — wiring route/action checks
        to these permissions is the next step.
      </p>
    </div>
  );
}
