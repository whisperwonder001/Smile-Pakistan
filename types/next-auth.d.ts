import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    role: string;
    patientId: string | null;
    doctorId: string | null;
  }

  interface Session {
    user: {
      id: string;
      role: string;
      patientId: string | null;
      doctorId: string | null;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: string;
    patientId?: string | null;
    doctorId?: string | null;
  }
}
