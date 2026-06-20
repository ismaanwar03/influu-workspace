import { Injectable, OnModuleInit } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

// 1. Maintain a single global instance to prevent pool duplication during hot-reloads
const connectionString = process.env.DATABASE_URL
const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    // 2. Pass the driver adapter directly to the client constructor
    super({ adapter })
  }

  async onModuleInit() {
    // 3. Verifies that the database driver can establish a connection at startup
    await pool.connect().then((client) => client.release())
  }
}
