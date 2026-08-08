require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');

async function main() {
  console.log('Connecting to database...');
  const pool = new Pool({ 
    connectionString: process.env.DATABASE_URL,
    connectionTimeoutMillis: 20000
  });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  // Remove old admin if exists
  const oldAdmin = await prisma.user.findUnique({ where: { phone: '01700000000' } });
  if (oldAdmin) {
    await prisma.user.delete({ where: { phone: '01700000000' } });
    console.log('Old admin removed.');
  }

  // Check if habib already exists
  const existing = await prisma.user.findUnique({ where: { phone: 'habib' } });

  if (existing) {
    await prisma.user.update({
      where: { phone: 'habib' },
      data: { name: 'Habib', password: '267993', role: 'ADMIN' }
    });
    console.log('Admin updated.');
  } else {
    await prisma.user.create({
      data: {
        name: 'Habib',
        phone: 'habib',
        password: '267993',
        role: 'ADMIN',
      }
    });
    console.log('Admin created.');
  }

  console.log('');
  console.log('=== ADMIN CREDENTIALS ===');
  console.log('Username : habib');
  console.log('Password : 267993');
  console.log('=========================');

  await pool.end();
}

main().catch(e => {
  console.error('Error:', e.message);
  process.exit(1);
});
