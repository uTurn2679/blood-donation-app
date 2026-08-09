require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');

async function main() {
  console.log('Connecting to db to remove seed6 data...');
  const pool = new Pool({ 
    connectionString: process.env.DATABASE_URL,
    connectionTimeoutMillis: 20000
  });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  const phoneNumbers = [
    '01925954988', '01814603976', '01832195049', '01842087308', '01340001126',
    '01880296018', '01306789706', '01879870343', '01614167202', '01321866838',
    '01977286827', '01970012039', '01738290328', '01779298915', '01951450010',
    '01740815600', '01590066478', '01814217965', '01913975470', '01319585923',
    '01309181832', '01890039754', '01796868911', '01759238439', '01772395194',
    '01570209978', '01404884456', '01969546356', '01408135634', '01615707891'
  ];

  // First delete donor profiles for these users
  const users = await prisma.user.findMany({
    where: { phone: { in: phoneNumbers } },
    select: { id: true }
  });

  const userIds = users.map(u => u.id);

  const deletedProfiles = await prisma.donorProfile.deleteMany({
    where: { userId: { in: userIds } }
  });

  const deletedUsers = await prisma.user.deleteMany({
    where: { id: { in: userIds } }
  });

  console.log(`Successfully deleted ${deletedUsers.count} users and ${deletedProfiles.count} donor profiles.`);
  await pool.end();
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
