require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');

async function main() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  const cseDonors = await prisma.donorProfile.findMany({
    where: { department: 'CSE', session: '25-26' },
    include: { user: true }
  });

  console.log(`Current CSE 25-26 donors in database: ${cseDonors.length}`);
  cseDonors.forEach((d, idx) => {
    console.log(`${idx + 1}. ${d.user.name} - ${d.user.phone} (${d.bloodGroup})`);
  });

  await pool.end();
}

main().catch(e => { console.error(e); process.exit(1); });
