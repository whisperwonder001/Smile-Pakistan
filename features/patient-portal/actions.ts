"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function updateProfile(data: { fullName: string; phone: string }) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Not authenticated");

  await prisma.user.update({
    where: { id: session.user.id },
    data: { fullName: data.fullName, phone: data.phone },
  });

  revalidatePath("/patient/profile");
}
