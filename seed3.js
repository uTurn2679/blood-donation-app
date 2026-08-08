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
    // Image 1: Civil
    { Name: 'Bisharup', Phone: '01979931437', BloodGroup: 'B+', Department: 'Civil', Session: '23-24' },
    { Name: 'Sagor', Phone: '01309631184', BloodGroup: 'B+', Department: 'Civil', Session: '23-24' },
    { Name: 'Mustaqueemul Bari', Phone: '01715452646', BloodGroup: 'O+', Department: 'Civil', Session: '23-24' },
    { Name: 'Rabin', Phone: '01409359775', BloodGroup: 'O+', Department: 'Civil', Session: '23-24' },
    { Name: 'Sahid', Phone: '01818291546', BloodGroup: 'B+', Department: 'Civil', Session: '22-23' },
    { Name: 'Farhan', Phone: '01709934588', BloodGroup: 'A+', Department: 'Civil', Session: '23-24' },
    { Name: 'Mofazzal', Phone: '01890125053', BloodGroup: 'O+', Department: 'Civil', Session: '23-24' },
    { Name: 'Ayat', Phone: '01959093639', BloodGroup: 'B+', Department: 'Civil', Session: '23-24' },
    { Name: 'Abu Musa', Phone: '01973175880', BloodGroup: 'B+', Department: 'Civil', Session: '23-24' },
    { Name: 'Surja', Phone: '01755493393', BloodGroup: 'O+', Department: 'Civil', Session: '23-24' },
    { Name: 'Shaif', Phone: '01922701359', BloodGroup: 'B+', Department: 'Civil', Session: '23-24' },
    { Name: 'Imran', Phone: '01901746221', BloodGroup: 'B+', Department: 'Civil', Session: '23-24' },
    { Name: 'Saiman', Phone: '01609847998', BloodGroup: 'O+', Department: 'Civil', Session: '23-24' },
    { Name: 'Anik', Phone: '01568144541', BloodGroup: 'O+', Department: 'Civil', Session: '23-24' },
    { Name: 'Susmoy', Phone: '01713597232', BloodGroup: 'O+', Department: 'Civil', Session: '23-24' },

    // Image 2: CE (Civil Engineering)
    { Name: 'সানিয়া কবির মিতু', Phone: '01645506221', BloodGroup: 'A+', Department: 'CE', Session: '23-24' },
    { Name: 'হাফিজা আক্তার ময়না', Phone: '01304491327', BloodGroup: 'O+', Department: 'CE', Session: '23-24' },
    { Name: 'মো: ইব্রাহিম হোসাইন', Phone: '01918057082', BloodGroup: 'O+', Department: 'CE', Session: '23-24' },
    { Name: 'অনিক হাসান', Phone: '01780997822', BloodGroup: 'B+', Department: 'CE', Session: '23-24' },
    { Name: 'তৌসিফ বিন ওমর', Phone: '01918285066', BloodGroup: 'O-', Department: 'CE', Session: '23-24' },
    { Name: 'লিটু অধিকারী', Phone: '01948000081', BloodGroup: 'B+', Department: 'CE', Session: '23-24' },

    // Image 3: Chemistry (CHE)
    { Name: 'রাজু', Phone: '01924539693', BloodGroup: 'O+', Department: 'CHE', Session: '23-24' },
    { Name: 'রিয়াদুল', Phone: '01705037475', BloodGroup: 'O+', Department: 'CHE', Session: '23-24' },
    { Name: 'রানা', Phone: '01904215558', BloodGroup: 'O+', Department: 'CHE', Session: '23-24' },
    { Name: 'সৌভিক', Phone: '01995264442', BloodGroup: 'B+', Department: 'CHE', Session: '23-24' },
    { Name: 'গোলাম রব্বানী', Phone: '01933312065', BloodGroup: 'A+', Department: 'CHE', Session: '23-24' },
    { Name: 'জুবায়ের', Phone: '01822263911', BloodGroup: 'A+', Department: 'CHE', Session: '23-24' },
    { Name: 'রিয়াদ', Phone: '01794505524', BloodGroup: 'B+', Department: 'CHE', Session: '23-24' },
    { Name: 'নয়ন ইসলাম', Phone: '01873609863', BloodGroup: 'A+', Department: 'CHE', Session: '22-23' },
    { Name: 'শরিফুল', Phone: '01745366773', BloodGroup: 'B+', Department: 'CHE', Session: '23-24' },
    { Name: 'প্রবাল রায়', Phone: '01756333243', BloodGroup: 'O+', Department: 'CHE', Session: '23-24' },
    { Name: 'সৌরভ রায়', Phone: '01909316232', BloodGroup: 'B+', Department: 'CHE', Session: '23-24' },
    { Name: 'শিহাব', Phone: '01717491990', BloodGroup: 'A+', Department: 'CHE', Session: '22-23' },
    { Name: 'তামিম', Phone: '01797008637', BloodGroup: 'A+', Department: 'CHE', Session: '22-23' },

    // Image 4: Unspecified (Probably CHE or BGE)
    { Name: 'কামরুল হক', Phone: '01646838241', BloodGroup: 'A+', Department: '', Session: '23-24' },
    { Name: 'মো: নাঈমুল হক', Phone: '01993675036', BloodGroup: 'A+', Department: '', Session: '23-24' },
    { Name: 'মো: রুমন রানা', Phone: '01904243551', BloodGroup: 'B+', Department: '', Session: '23-24' },
    { Name: 'কাওসার হাসান', Phone: '01856153665', BloodGroup: 'O+', Department: '', Session: '23-24' },
    { Name: 'তৌসিফ', Phone: '01998842487', BloodGroup: 'B+', Department: '', Session: '23-24' },
    { Name: 'তুহিন', Phone: '01985869942', BloodGroup: 'AB+', Department: '', Session: '23-24' },
    { Name: 'নিলয়', Phone: '01745113824', BloodGroup: 'O+', Department: '', Session: '23-24' },
    { Name: 'রমি', Phone: '01842471957', BloodGroup: 'A+', Department: '', Session: '23-24' },
    { Name: 'পার্থ বিশ্বাস', Phone: '01717080613', BloodGroup: 'AB+', Department: '', Session: '23-24' },
    { Name: 'জয়নাল নূরী', Phone: '01317599135', BloodGroup: 'AB+', Department: '', Session: '23-24' },
    { Name: 'আবির কবির', Phone: '01533976553', BloodGroup: 'A+', Department: '', Session: '23-24' },
    { Name: 'আশিক বিশ্বাস', Phone: '01756826396', BloodGroup: 'O+', Department: '', Session: '23-24' },
    { Name: 'সৈকত মন্ডল', Phone: '01518936606', BloodGroup: 'A+', Department: '', Session: '23-24' },

    // Image 5: BGE
    { Name: 'অর্পিতা মিত্র', Phone: '01814207926', BloodGroup: 'O+', Department: 'BGE', Session: '23-24' },
    { Name: 'সায়মা সাহাব', Phone: '01714410031', BloodGroup: 'B+', Department: 'BGE', Session: '23-24' },
    { Name: 'তানিয়া তাবাসসুম', Phone: '01312416912', BloodGroup: 'B+', Department: 'BGE', Session: '23-24' },
    { Name: 'তানজিদা', Phone: '01888157083', BloodGroup: 'A+', Department: 'BGE', Session: '23-24' },
    { Name: 'তমা রানী শীল', Phone: '01309757880', BloodGroup: 'O+', Department: 'BGE', Session: '23-24' },
    { Name: 'চন্দ্রা সাহা', Phone: '01737174849', BloodGroup: 'B+', Department: 'BGE', Session: '23-24' },
    { Name: 'অংকন হালদার', Phone: '01917741452', BloodGroup: 'O+', Department: 'BGE', Session: '23-24' },
    { Name: 'রেজুয়ান এলাহি', Phone: '01728212329', BloodGroup: 'O+', Department: 'BGE', Session: '23-24' },
    { Name: 'সার্থক চন্দ্র দত্ত', Phone: '01725348251', BloodGroup: 'B+', Department: 'BGE', Session: '23-24' },
    { Name: 'আতিকুর রহমান', Phone: '01618859352', BloodGroup: 'A+', Department: 'BGE', Session: '23-24' },
    { Name: 'হাসিবুর রহমান', Phone: '01860513811', BloodGroup: 'B+', Department: 'BGE', Session: '23-24' },
    { Name: 'নুহাইবা নুজহাত', Phone: '01961346387', BloodGroup: 'B+', Department: 'BGE', Session: '23-24' },
    { Name: 'তুলি অধিকারী', Phone: '01318527969', BloodGroup: 'O+', Department: 'BGE', Session: '23-24' },
    { Name: 'ইশরাত জাহান প্রীতি', Phone: '01708920306', BloodGroup: 'AB+', Department: 'BGE', Session: '23-24' },
    { Name: 'লুবাবা শাহজাবীন', Phone: '01712172302', BloodGroup: 'AB+', Department: 'BGE', Session: '23-24' },
    { Name: 'খাদিজা আক্তার', Phone: '01404699929', BloodGroup: 'O+', Department: 'BGE', Session: '23-24' },
    { Name: 'তাহেরা আক্তার', Phone: '01601779322', BloodGroup: 'O+', Department: 'BGE', Session: '23-24' },
    { Name: 'সিদরাতুল মুন্তাহা', Phone: '01799227313', BloodGroup: 'O+', Department: 'BGE', Session: '23-24' },
    { Name: 'শাওন মল্লিক', Phone: '01833045755', BloodGroup: 'O+', Department: 'BGE', Session: '23-24' },
    { Name: 'সাহিদী রহমান', Phone: '01966450749', BloodGroup: 'A+', Department: 'BGE', Session: '23-24' },
    { Name: 'সুদিপ্ত শীল', Phone: '01981264235', BloodGroup: 'AB+', Department: 'BGE', Session: '23-24' },
    { Name: 'আজিজুল', Phone: '01758537170', BloodGroup: 'A+', Department: 'BGE', Session: '22-23' },
    { Name: 'মুশফিকা', Phone: '01989030484', BloodGroup: 'B-', Department: 'BGE', Session: '23-24' },
    { Name: 'আহাসানুল কবীর', Phone: '01305200821', BloodGroup: 'B-', Department: 'BGE', Session: '23-24' }
  ];

  let addedCount = 0;
  for (const row of data) {
    const existingUser = await prisma.user.findUnique({ where: { phone: row.Phone } });
    if (!existingUser) {
      await prisma.user.create({
        data: {
          name: row.Name, 
          phone: row.Phone, 
          password: 'default_password', 
          role: 'DONOR',
          donorProfile: {
            create: { 
              bloodGroup: row.BloodGroup, 
              ...(row.Department && { department: row.Department }), 
              ...(row.Session && { session: row.Session }) 
            }
          }
        }
      });
      addedCount++;
    }
  }
  console.log('Added ' + addedCount + ' new donors from batch 3.');
}
main().catch(console.error).finally(() => process.exit(0));
