require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');

async function main() {
  console.log('Connecting to db for CSE donor name updates...');
  const pool = new Pool({ 
    connectionString: process.env.DATABASE_URL,
    connectionTimeoutMillis: 20000
  });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  const nameUpdates = [
    { Phone: '01814603976', NewName: 'Ontora' },      // #2
    { Phone: '01832195049', NewName: 'Rohan' },        // #3
    { Phone: '01842087308', NewName: 'Nahid' },        // #4
    { Phone: '01880296018', NewName: 'Tonni' },        // #6
    { Phone: '01306789706', NewName: 'Onjon Bosu' },   // #7
    { Phone: '01879870343', NewName: 'Inna' },         // #8
    { Phone: '01977286827', NewName: 'Chondon' },      // #11
    { Phone: '01970012039', NewName: 'Sakir' },        // #12
    { Phone: '01738290328', NewName: 'Rakib Hasan' },   // #13
    { Phone: '01779298915', NewName: 'Akifa Jahan' },  // #14
    { Phone: '01951450010', NewName: 'Siam' },         // #15
    { Phone: '01590066478', NewName: 'Prapti' },       // #17
    { Phone: '01814217965', NewName: 'Iftija' },       // #18
    { Phone: '01913975470', NewName: 'Nurnahar' },     // #19
    { Phone: '01309181832', NewName: 'Israt' },        // #21
    { Phone: '01570209978', NewName: 'Joy' },          // #26
    { Phone: '01615707891', NewName: 'Nabila' },       // #30
  ];

  let updatedCount = 0;

  for (const item of nameUpdates) {
    const user = await prisma.user.findUnique({
      where: { phone: item.Phone }
    });

    if (user) {
      await prisma.user.update({
        where: { id: user.id },
        data: { name: item.NewName }
      });
      console.log(`Updated ${item.Phone}: ${user.name} -> ${item.NewName}`);
      updatedCount++;
    } else {
      console.log(`User with phone ${item.Phone} not found.`);
    }
  }

  console.log(`Successfully updated ${updatedCount} donor names!`);
  await pool.end();
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
