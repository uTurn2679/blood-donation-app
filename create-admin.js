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

  const adminPhone = '01700000000'; // Admin phone number
  const adminPassword = 'admin123';  // Admin password

  // Check if admin already exists
  const existing = await prisma.user.findUnique({ where: { phone: adminPhone } });

  if (existing) {
    // Update existing user to ADMIN
    await prisma.user.update({
      where: { phone: adminPhone },
      data: { role: 'ADMIN', password: adminPassword }
    });
    console.log(`✅ Existing user (${adminPhone}) updated to ADMIN role.`);
  } else {
    // Create new admin user
    await prisma.user.create({
      data: {
        name: 'Admin',
        phone: adminPhone,
        password: adminPassword,
        role: 'ADMIN',
      }
    });
    console.log(`✅ Admin user created!`);
  }

  console.log('');
  console.log('=== ADMIN LOGIN CREDENTIALS ===');
  console.log(`Phone   : ${adminPhone}`);
  console.log(`Password: ${adminPassword}`);
  console.log('================================');

  await pool.end();
}

main().catch(e => {
  console.error('❌ Error:', e.message);
  process.exit(1);
});
