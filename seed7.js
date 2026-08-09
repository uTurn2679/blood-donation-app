require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');

async function main() {
  console.log('Connecting to db for CSE 25-26 donor seed...');
  const pool = new Pool({ 
    connectionString: process.env.DATABASE_URL,
    connectionTimeoutMillis: 20000
  });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  const data = [
    { Name: 'লতিফুর রহমান', Phone: '01925954988', BloodGroup: 'O+', Department: 'CSE', Session: '25-26' },
    { Name: 'আয়েশা', Phone: '01814603976', BloodGroup: 'AB-', Department: 'CSE', Session: '25-26' },
    { Name: 'সুজন', Phone: '01832195049', BloodGroup: 'B+', Department: 'CSE', Session: '25-26' },
    { Name: 'নামিরা', Phone: '01842087308', BloodGroup: 'AB+', Department: 'CSE', Session: '25-26' },
    { Name: 'দীপ বিশ্বাস', Phone: '01340001126', BloodGroup: 'A+', Department: 'CSE', Session: '25-26' },
    { Name: 'জয়ী', Phone: '01880296018', BloodGroup: 'B+', Department: 'CSE', Session: '25-26' },
    { Name: 'অংকন ভদ্র', Phone: '01306789706', BloodGroup: 'O+', Department: 'CSE', Session: '25-26' },
    { Name: 'মোঃ আবু তাহের খোকা', Phone: '01879870343', BloodGroup: 'O+', Department: 'CSE', Session: '25-26' },
    { Name: 'ফারজানা আক্তার সুমাইয়া', Phone: '01614167202', BloodGroup: 'O+', Department: 'CSE', Session: '25-26' },
    { Name: 'Shaoly Chowdhury', Phone: '01321866838', BloodGroup: 'AB+', Department: 'CSE', Session: '25-26' },
    { Name: 'চয়ন', Phone: '01977286827', BloodGroup: 'A+', Department: 'CSE', Session: '25-26' },
    { Name: 'রাকিব হোসেন', Phone: '01970012039', BloodGroup: 'A+', Department: 'CSE', Session: '25-26' },
    { Name: 'সাব্বির খন্দকার', Phone: '01738290328', BloodGroup: 'O-', Department: 'CSE', Session: '25-26' },
    { Name: 'ইশতিয়াক আহমেদ', Phone: '01779298915', BloodGroup: 'A-', Department: 'CSE', Session: '25-26' },
    { Name: 'ডিসাদ', Phone: '01951450010', BloodGroup: 'AB+', Department: 'CSE', Session: '25-26' },
    { Name: 'Shihab', Phone: '01740815600', BloodGroup: 'AB+', Department: 'CSE', Session: '25-26' },
    { Name: 'শিহাব', Phone: '01590066478', BloodGroup: 'B+', Department: 'CSE', Session: '25-26' },
    { Name: 'রওজা', Phone: '01814217965', BloodGroup: 'O+', Department: 'CSE', Session: '25-26' },
    { Name: 'নুসরাত', Phone: '01913975470', BloodGroup: 'O+', Department: 'CSE', Session: '25-26' },
    { Name: 'মারুফ', Phone: '01319585923', BloodGroup: 'B+', Department: 'CSE', Session: '25-26' },
    { Name: 'ইমরান', Phone: '01309181832', BloodGroup: 'O+', Department: 'CSE', Session: '25-26' },
    { Name: 'আবু সাকির', Phone: '01890039754', BloodGroup: 'B+', Department: 'CSE', Session: '25-26' },
    { Name: 'আফরিন', Phone: '01796868911', BloodGroup: 'A+', Department: 'CSE', Session: '25-26' },
    { Name: 'আশিকুর', Phone: '01759238439', BloodGroup: 'A+', Department: 'CSE', Session: '25-26' },
    { Name: 'আরিসুল', Phone: '01772395194', BloodGroup: 'O+', Department: 'CSE', Session: '25-26' },
    { Name: 'তামিম', Phone: '01570209978', BloodGroup: 'O+', Department: 'CSE', Session: '25-26' },
    { Name: 'প্রলেস', Phone: '01404884456', BloodGroup: 'A+', Department: 'CSE', Session: '25-26' },
    { Name: 'এনায়েত', Phone: '01969546356', BloodGroup: 'B+', Department: 'CSE', Session: '25-26' },
    { Name: 'আশরাফ', Phone: '01408135634', BloodGroup: 'O+', Department: 'CSE', Session: '25-26' },
    { Name: 'নাভিন্তা', Phone: '01615707891', BloodGroup: 'AB+', Department: 'CSE', Session: '25-26' },
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
            department: item.Department,
            session: item.Session
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
