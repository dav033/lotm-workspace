import 'dotenv/config'
import { defineConfig } from 'prisma/config'

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    // PostgreSQL usa línea base propia; migraciones SQLite fueron retiradas.
    path: 'prisma/migrations-postgresql',
  },
  datasource: {
    // Prisma CLI usa conexión directa para migraciones y Prisma Studio. El
    // runtime utiliza DATABASE_URL (pooled) desde src/server/db.ts.
    url: process.env.DIRECT_URL ?? process.env.DATABASE_URL ?? '',
  },
})
