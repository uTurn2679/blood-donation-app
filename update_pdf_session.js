require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');
const fs = require('fs');

async function main() {
  console.log('Connecting to db to update PDF donor sessions to 24-25...');
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  // Read seed_pdf_all.js content to get all phone numbers imported from PDF
  const seedFile = fs.readFileSync('./seed_pdf_all.js', 'utf8');
  const phoneMatches = seedFile.match(/Phone:\s*'(\d+)'/g);

  if (!phoneMatches) {
    console.error('No phones found in seed_pdf_all.js');
    process.exit(1);
  }

  const phones = phoneMatches.map(p => p.replace(/Phone:\s*'/, '').replace(/'/, ''));
  console.log(`Found ${phones.length} phone numbers from PDF import list.`);

  // Find users with these phones
  const users = await prisma.user.findMany({
    where: { phone: { in: phones } },
    select: { id: true }
  });

  const userIds = users.map(u => u.id);

  // Update donorProfiles for these users
  const updateResult = await prisma.donorProfile.updateMany({
    where: { userId: { in: userIds } },
    data: { session: '24-25' }
  });

  console.log(`Successfully updated ${updateResult.count} donor profiles to session "24-25"!`);

  await pool.end();
}

main().catch(e => { console.error(e); process.exit(1); });
