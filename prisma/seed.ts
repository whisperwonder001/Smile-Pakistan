import { PrismaClient } from "@prisma/client";
import { runSeed } from "./seedLogic";

// CLI entrypoint (npm run db:seed). Core logic lives in seedLogic.ts so it
// can also run from app/api/setup/route.ts for no-terminal seeding.
const prisma = new PrismaClient();

runSeed(prisma)
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
