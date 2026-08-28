require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');

async function main() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  const totalDonors = await prisma.donorProfile.count();
  const totalUsers = await prisma.user.count();

  console.log(`Total Donors in Database: ${totalDonors}`);
  console.log(`Total Users in Database: ${totalUsers}`);

  await pool.end();
}

main().catch(e => { console.error(e); process.exit(1); });
