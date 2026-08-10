-- CreateTable: account_activation_tokens
CREATE TABLE "account_activation_tokens" (
  "id" TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL,
  "tokenHash" TEXT NOT NULL,
  "expiresAt" TIMESTAMP NOT NULL,
  "usedAt" TIMESTAMP,
  "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
  CONSTRAINT "account_activation_tokens_userId_fkey" FOREIGN KEY ("userId")
    REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE UNIQUE INDEX "account_activation_tokens_tokenHash_key"
  ON "account_activation_tokens"("tokenHash");

CREATE INDEX "account_activation_tokens_userId_idx"
  ON "account_activation_tokens"("userId");
