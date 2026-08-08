import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

let prisma: PrismaClient;

if (typeof window === "undefined") {
  if (!globalForPrisma.prisma) {
    const connectionString = process.env.DATABASE_URL || 'postgres://dummy:dummy@dummy.com/dummy';
    const pool = new Pool({ connectionString });
    const adapter = new PrismaPg(pool);
    globalForPrisma.prisma = new PrismaClient({ adapter, log: ['query'] });
  }
  prisma = globalForPrisma.prisma;
}

export { prisma };
