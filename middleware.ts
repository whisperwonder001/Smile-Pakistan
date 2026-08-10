import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isPatientRoute =
    pathname.startsWith("/patient") && !pathname.startsWith("/patient/login");
  const isDoctorRoute =
    pathname.startsWith("/doctor") && !pathname.startsWith("/doctor/login");

  if (isPatientRoute) {
    const role = req.auth?.user?.role;
    if (!req.auth || role !== "PATIENT") {
      return NextResponse.redirect(new URL("/patient/login", req.nextUrl.origin));
    }
  }

  if (isDoctorRoute) {
    const role = req.auth?.user?.role;
    if (!req.auth || role !== "DOCTOR") {
      return NextResponse.redirect(new URL("/doctor/login", req.nextUrl.origin));
    }
  }

  const isAdminRoute =
    pathname.startsWith("/admin") && !pathname.startsWith("/admin/login");
  if (isAdminRoute) {
    const role = req.auth?.user?.role;
    if (!req.auth || !["ADMIN", "RECEPTIONIST"].includes(role ?? "")) {
      return NextResponse.redirect(new URL("/admin/login", req.nextUrl.origin));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/patient/:path*", "/doctor/:path*", "/admin/:path*"],
};
