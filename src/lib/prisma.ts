import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

let prisma: PrismaClient;

if (globalForPrisma.prisma) {
  prisma = globalForPrisma.prisma;
} else {
  // Safe initialization: Don't crash at build time if DATABASE_URL is missing
  const connectionString = process.env.DATABASE_URL || 'postgres://dummy:dummy@dummy.com/dummy';
  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  prisma = new PrismaClient({ adapter, log: ['query'] });
  if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
}

export { prisma };
