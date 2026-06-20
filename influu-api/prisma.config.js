require('dotenv/config') // 👈 CRITICAL: Force-loads your .env file instantly
const { defineConfig, env } = require('prisma/config')

module.exports = defineConfig({
  schema: 'prisma/schema.prisma',

  migrations: {
    path: 'prisma/migrations',
    seed: 'TS_NODE_PROJECT=./tsconfig.server.json tsx -r tsconfig-paths/register prisma/seed.ts',
  },

  datasource: {
    // Falls back to your direct process string safely if the helper delays
    url: env('DATABASE_URL') || process.env.DATABASE_URL,
  },
})

