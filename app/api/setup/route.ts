import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { runSeed } from "@/prisma/seedLogic";

/**
 * Visit /api/setup?key=YOUR_SETUP_SECRET once after a fresh deploy to seed
 * the database — no terminal required, works from a phone browser. Gated
 * on SETUP_SECRET so a guessable URL can't be used to trigger DB writes.
 * Safe to hit more than once: runSeed() is upsert/existence-check guarded
 * throughout, so re-running it doesn't duplicate data.
 */
export async function GET(req: NextRequest) {
  const key = req.nextUrl.searchParams.get("key");
  const expected = process.env.SETUP_SECRET;

  if (!expected) {
    return NextResponse.json(
      { error: "SETUP_SECRET isn't set in this deployment's environment variables." },
      { status: 500 }
    );
  }
  if (key !== expected) {
    return NextResponse.json({ error: "Not authorized." }, { status: 401 });
  }

  try {
    await runSeed(prisma);
    return new NextResponse(
      `<!doctype html>
      <html>
        <body style="font-family: -apple-system, sans-serif; max-width: 480px; margin: 60px auto; padding: 0 20px; color: #1f2937;">
          <h1 style="color: #0d9488;">✓ Database seeded</h1>
          <p>Branches, treatments, doctors, demo patient, admin, and sample content are ready.</p>
          <p><strong>Patient login:</strong> ayesha.khan@example.com / patient123<br/>
          <strong>Doctor login:</strong> ahsan.malik@smilepakistan.pk / doctor123<br/>
          <strong>Admin login:</strong> admin@smilepakistan.pk / admin123</p>
          <p>You can close this page.</p>
        </body>
      </html>`,
      { headers: { "Content-Type": "text/html" } }
    );
  } catch (error) {
    console.error("[setup] seed failed", error);
    return NextResponse.json(
      { error: "Seeding failed — check deployment logs.", detail: String(error) },
      { status: 500 }
    );
  }
}
