require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');

async function main() {
  console.log('Connecting to db...');
  const pool = new Pool({ 
    connectionString: process.env.DATABASE_URL,
    connectionTimeoutMillis: 20000
  });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  const data = [
    { Name: 'লতিফুর রহমান', Phone: '01925954988', BloodGroup: 'O+', Session: '53' },
    { Name: 'আয়েশা', Phone: '01814603976', BloodGroup: 'AB-', Session: '' },
    { Name: 'সুজন', Phone: '01832195049', BloodGroup: 'B+', Session: '60' },
    { Name: 'নামিরা', Phone: '01842087308', BloodGroup: 'AB+', Session: '75' },
    { Name: 'দীপ বিশ্বাস', Phone: '01340001126', BloodGroup: 'A+', Session: '65' },
    { Name: 'জয়ী', Phone: '01880296018', BloodGroup: 'B+', Session: '97' },
    { Name: 'অংকন ভদ্র', Phone: '01306789706', BloodGroup: 'O+', Session: '73' },
    { Name: 'মোঃ আবু তাহের খোকা', Phone: '01879870343', BloodGroup: 'O+', Session: '96' },
    { Name: 'সুমাইয়া আক্তার', Phone: '01614167202', BloodGroup: 'O+', Session: '60' },
    { Name: 'Shaoly Chowdhury', Phone: '01321866838', BloodGroup: 'AB+', Session: '38' },
    { Name: 'চয়ন', Phone: '01977286827', BloodGroup: 'A+', Session: '' },
    { Name: 'রাকিব হোসেন', Phone: '01970012039', BloodGroup: 'A+', Session: '86' },
    { Name: 'সাব্বির খন্দকার', Phone: '01738290328', BloodGroup: 'O-', Session: '52' },
    { Name: 'ইশতিয়াক আহমেদ', Phone: '01779298915', BloodGroup: 'A-', Session: '' },
    { Name: 'ডিসাদ', Phone: '01951450010', BloodGroup: 'AB+', Session: '' },
    { Name: 'Shihab', Phone: '01740815600', BloodGroup: 'B+', Session: '' },
    { Name: 'শিহাব', Phone: '01590066478', BloodGroup: 'O+', Session: '49' },
    { Name: 'রওজা', Phone: '01814217965', BloodGroup: 'O+', Session: '' },
    { Name: 'নুসরাত', Phone: '01913975470', BloodGroup: 'O+', Session: '47' },
    { Name: 'মারুফ', Phone: '01319585923', BloodGroup: 'O+', Session: '' },
    { Name: 'ইমরান', Phone: '01309181832', BloodGroup: 'O+', Session: '46' },
    { Name: 'আবু সাকির', Phone: '01890039754', BloodGroup: 'B+', Session: '' },
    { Name: 'আফরিন', Phone: '01796868911', BloodGroup: 'A+', Session: '19' },
    { Name: 'আশিকুর', Phone: '01759238439', BloodGroup: 'A+', Session: '' },
    { Name: 'আরিসুল', Phone: '01772395194', BloodGroup: 'O+', Session: '' },
    { Name: 'তামিম', Phone: '01570209978', BloodGroup: 'O+', Session: '54' },
    { Name: 'প্রলেস', Phone: '01404884456', BloodGroup: 'B+', Session: '' },
    { Name: 'এনায়েত', Phone: '01969546356', BloodGroup: 'B+', Session: '' },
    { Name: 'আশরাফ', Phone: '01408135634', BloodGroup: 'O+', Session: '47' },
    { Name: 'নাভিন্তা', Phone: '01615707891', BloodGroup: 'AB+', Session: '54' },
  ];

  let added = 0;
  let skipped = 0;

  for (const item of data) {
    const existing = await prisma.user.findUnique({
      where: { phone: item.Phone }
    });

    if (existing) {
      skipped++;
      continue;
    }

    await prisma.user.create({
      data: {
        name: item.Name,
        phone: item.Phone,
        password: 'default_password',
        role: 'DONOR',
        donorProfile: {
          create: {
            bloodGroup: item.BloodGroup,
            ...(item.Session ? { session: item.Session } : {})
          }
        }
      }
    });
    added++;
  }

  console.log(`Done! Added: ${added}, Skipped (duplicates): ${skipped}`);
  await pool.end();
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
