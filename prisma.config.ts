import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env.DATABASE_URL!,
    // Connexion directe (non poolée) utilisée par `prisma migrate dev` comme base fantôme.
    // Nécessaire avec Neon car DATABASE_URL passe par le pooler (pgbouncer).
    shadowDatabaseUrl: process.env.DIRECT_URL,
  },
});
