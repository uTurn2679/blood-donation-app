require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');
const xlsx = require('xlsx');

async function main() {
  console.log('Connecting to db...');
  const pool = new Pool({ 
    connectionString: process.env.DATABASE_URL,
    connectionTimeoutMillis: 20000 // Give Neon 20 seconds to wake up
  });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  console.log('Reading excel...');
  const workbook = xlsx.readFile('Donor_Data_Full.xlsx');
  const sheetName = workbook.SheetNames[0];
  const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

  let addedCount = 0;
  for (const row of data) {
    const name = row.Name?.toString().trim();
    const phone = row.Phone?.toString().trim();
    const bloodGroup = row.BloodGroup?.toString().trim();
    const department = row.Department?.toString().trim();
    const session = row.Session?.toString().trim();

    if (!name || !phone || !bloodGroup) continue;

    const existingUser = await prisma.user.findUnique({ where: { phone } });
    if (!existingUser) {
      await prisma.user.create({
        data: {
          name, phone, password: 'default_password', role: 'DONOR',
          donorProfile: {
            create: { bloodGroup, ...(department && { department }), ...(session && { session }) }
          }
        }
      });
      addedCount++;
    }
  }
  console.log('Added ' + addedCount + ' donors.');
}
main().catch(console.error).finally(() => process.exit(0));
