const fs = require('fs');
const xlsx = require('xlsx');

const rawData = [
  // Page 1 (O+)
  { Name: 'Shakil', Phone: '01942081564', BloodGroup: 'O+', Department: 'AGR', Session: '21-22' },
  { Name: 'মরিয়ম বেগম', Phone: '01331430206', BloodGroup: 'O+', Department: 'হিসাববিজ্ঞান ও তথ্য পদ্ধতি', Session: '22-23' },
  { Name: 'সোমা মনি', Phone: '01405902322', BloodGroup: 'O+', Department: 'হিসাববিজ্ঞান ও তথ্য পদ্ধতি', Session: '22-23' },
  { Name: 'মোঃ শিমুল', Phone: '01302168318', BloodGroup: 'O+', Department: 'FNB', Session: '22-23' },
  { Name: 'তাপস', Phone: '01810982746', BloodGroup: 'O+', Department: 'FNB', Session: '22-23' },
  { Name: 'রিমি আক্তার', Phone: '01631020306', BloodGroup: 'O+', Department: 'গণিত', Session: '21-22' },
  { Name: 'ঐশী ফরামা', Phone: '01726633782', BloodGroup: 'O+', Department: 'গণিত', Session: '22-23' },
  { Name: 'শেফালী', Phone: '01723701705', BloodGroup: 'O+', Department: 'গণিত', Session: '22-23' },
  { Name: 'দেবা কুমার', Phone: '01319305728', BloodGroup: 'O+', Department: 'গণিত', Session: '22-23' },
  { Name: 'নয়ন দেব', Phone: '01758522825', BloodGroup: 'O+', Department: 'গণিত', Session: '22-23' },
  { Name: 'রকিব', Phone: '01703400952', BloodGroup: 'O+', Department: 'SOC', Session: '22-23' },
  { Name: 'রোমিজ', Phone: '01777176692', BloodGroup: 'O+', Department: 'SOC', Session: '22-23' },
  { Name: 'মোঃ ফাহিম', Phone: '01618308297', BloodGroup: 'O+', Department: 'SOC', Session: '22-23' },
  { Name: 'মোঃ ফাহিম', Phone: '01303910126', BloodGroup: 'O+', Department: 'অর্থনীতি', Session: '22-23' },
  { Name: 'সেতু', Phone: '01987204355', BloodGroup: 'O+', Department: 'অর্থনীতি', Session: '22-23' },
  { Name: 'নদী', Phone: '01320786353', BloodGroup: 'O+', Department: 'অর্থনীতি', Session: '22-23' },
  { Name: 'তন্নী', Phone: '01986630484', BloodGroup: 'O+', Department: 'অর্থনীতি', Session: '22-23' },
  { Name: 'সাদিয়া রহমান', Phone: '01317595778', BloodGroup: 'O+', Department: 'রসায়ন', Session: '2022-23' },
  { Name: 'রিয়া', Phone: '01608420661', BloodGroup: 'O+', Department: 'রসায়ন', Session: '22-23' },
  { Name: 'আজিজ', Phone: '01521766999', BloodGroup: 'O+', Department: 'রসায়ন', Session: '22-23' },
  { Name: 'সুমন হোসেন', Phone: '01309646720', BloodGroup: 'O+', Department: 'রসায়ন', Session: '22-23' },
  { Name: 'রুবাইদ হোসেন', Phone: '01754005060', BloodGroup: 'O+', Department: 'রসায়ন', Session: '22-23' },
  { Name: 'অন্তর', Phone: '01878966344', BloodGroup: 'O+', Department: 'BMB', Session: '22-23' },
  { Name: 'রাসেল', Phone: '01741984169', BloodGroup: 'O+', Department: 'BMB', Session: '22-23' },

  // Page 2 (A+)
  { Name: 'রানা শেখ', Phone: '01772552694', BloodGroup: 'A+', Department: 'ECO', Session: '22-23' },
  { Name: 'রাফি', Phone: '01771509303', BloodGroup: 'A+', Department: 'ECO', Session: '22-23' },
  { Name: 'সাজিদ', Phone: '01861757242', BloodGroup: 'A+', Department: 'BMB', Session: '22-23' },
  { Name: 'ইমরান', Phone: '01607076806', BloodGroup: 'A+', Department: 'BMB', Session: '22-23' },
  { Name: 'ওসামা', Phone: '01826719912', BloodGroup: 'A+', Department: 'BMB', Session: '22-23' },
  { Name: 'মামুন', Phone: '01795937063', BloodGroup: 'A+', Department: 'BMB', Session: '22-23' },
  { Name: 'রূপা', Phone: '01870245465', BloodGroup: 'A+', Department: 'BGE', Session: '22-23' },
  { Name: 'জয় বাবু', Phone: '01521756535', BloodGroup: 'A+', Department: 'BGE', Session: '22-23' },
  { Name: 'জিয়াদ', Phone: '01795816126', BloodGroup: 'A+', Department: 'BGE', Session: '22-23' },
  { Name: 'ইতিরাজ', Phone: '01760637670', BloodGroup: 'A+', Department: 'FE', Session: '22-23' },
  { Name: 'তাহমিন', Phone: '01991693830', BloodGroup: 'A+', Department: 'AIS', Session: '22-23' },
  { Name: 'ইমন', Phone: '01614065341', BloodGroup: 'A+', Department: 'AIS', Session: '22-23' },
  { Name: 'রাইসা', Phone: '01923552699', BloodGroup: 'A+', Department: 'AGRI', Session: '21-22' },
  { Name: 'অনন্যা', Phone: '01988876638', BloodGroup: 'A+', Department: 'AGR', Session: '22-23' },
  { Name: 'ফারহানা', Phone: '01873442336', BloodGroup: 'A+', Department: 'AGR', Session: '21-22' },
  { Name: 'বিপুল', Phone: '01750968266', BloodGroup: 'A+', Department: 'AGR', Session: '22-23' },
  { Name: 'সোয়াইব', Phone: '01306712499', BloodGroup: 'A+', Department: 'AGR', Session: '22-23' },
  { Name: 'সৌরভ', Phone: '01908291430', BloodGroup: 'A+', Department: 'AGR', Session: '22-23' },
  { Name: 'সাব্বির', Phone: '01851384750', BloodGroup: 'A+', Department: 'AGR', Session: '22-23' },
  { Name: 'হাসান', Phone: '01671836069', BloodGroup: 'A+', Department: 'AGR', Session: '22-23' },
  { Name: 'ফাতেমা', Phone: '01988787359', BloodGroup: 'A+', Department: 'PS', Session: '22-23' },
  { Name: 'প্রতিমা মন্ডল', Phone: '01794524759', BloodGroup: 'A+', Department: 'PS', Session: '22-23' },
  { Name: 'সাব্বির মাহমুদ', Phone: '01982555691', BloodGroup: 'A+', Department: 'PS', Session: '22-23' },
  { Name: 'শুভ বিন ইসলাম', Phone: '01821651761', BloodGroup: 'A+', Department: 'PS', Session: '22-23' },

  // Page 3 (B+)
  { Name: 'রাকিব হাসান', Phone: '01623377012', BloodGroup: 'B+', Department: 'BGE', Session: '21-22' },
  { Name: 'আব্দুর রহমান', Phone: '01305871550', BloodGroup: 'B+', Department: 'BGE', Session: '21-22' },
  { Name: 'মৃত্তিকা দাস', Phone: '01786936273', BloodGroup: 'B+', Department: 'BGE', Session: '21-22' },
  { Name: 'শিউলি', Phone: '01874918605', BloodGroup: 'B+', Department: 'BGE', Session: '21-22' },
  { Name: 'আনোয়ার হোসেন', Phone: '01796710082', BloodGroup: 'B+', Department: 'BGE', Session: '21-22' },
  { Name: 'জান্নাতুল', Phone: '01948038899', BloodGroup: 'B+', Department: 'BGE', Session: '21-22' },
  { Name: 'মিনহাজুল', Phone: '01940680911', BloodGroup: 'B+', Department: 'THM', Session: '23-24' },
  { Name: 'মো: আয়াতুল্লাহ', Phone: '01784093294', BloodGroup: 'B+', Department: 'PAD', Session: '18-19' },
  { Name: 'লুৎফর রহমান', Phone: '01728375883', BloodGroup: 'B+', Department: 'ASVM', Session: '22-23' },
  { Name: 'আরাফাত', Phone: '01876227706', BloodGroup: 'B+', Department: 'ACCE', Session: '22-23' },
  { Name: 'হাবিব', Phone: '01720335224', BloodGroup: 'B+', Department: 'ACCE', Session: '22-23' },
  { Name: 'ফাতেমা', Phone: '01568823464', BloodGroup: 'B+', Department: 'PS', Session: '19-20' },
  { Name: 'হাবিবুর', Phone: '01712121338', BloodGroup: 'B+', Department: 'ACCE', Session: '18-19' },
  { Name: 'ইমন', Phone: '01759133623', BloodGroup: 'B+', Department: 'Civil', Session: '22-23' },
  { Name: 'দিশা', Phone: '01702283327', BloodGroup: 'B+', Department: 'PS', Session: '22-23' },
  { Name: 'ফাহমিদা', Phone: '01793797446', BloodGroup: 'B+', Department: 'BGE', Session: '22-23' },
  { Name: 'আনমুন রহমান', Phone: '01760451223', BloodGroup: 'B+', Department: 'Psy', Session: '22-23' },
  { Name: 'সুমাইয়া', Phone: '01893331416', BloodGroup: 'B+', Department: 'ECO', Session: '22-23' },
  { Name: 'নয়ন', Phone: '01753226926', BloodGroup: 'B+', Department: 'SOC', Session: '22-23' },
  { Name: 'সিয়াম', Phone: '01970271169', BloodGroup: 'B+', Department: 'Law', Session: '21-22' },
  { Name: 'তুষার', Phone: '01754466007', BloodGroup: 'B+', Department: 'EEE', Session: '22-23' },
  { Name: 'মাহির', Phone: '01991531185', BloodGroup: 'B+', Department: 'Soil', Session: '22-23' },
  { Name: 'রানু', Phone: '01922280153', BloodGroup: 'B+', Department: 'SOC', Session: '21-22' },
  { Name: 'সৌমিক', Phone: '01708678732', BloodGroup: 'B+', Department: 'CSE', Session: '21-22' },

  // Page 4 (B+)
  { Name: 'নাহিদ', Phone: '01725129771', BloodGroup: 'B+', Department: '', Session: '' },
  { Name: 'ইউসুফ', Phone: '01732894214', BloodGroup: 'B+', Department: '', Session: '' },
  { Name: 'মাসুম', Phone: '01849754619', BloodGroup: 'B+', Department: '', Session: '' },
  { Name: 'নাঈম', Phone: '01987667131', BloodGroup: 'B+', Department: '', Session: '' },
  { Name: 'আয়েশা আক্তার', Phone: '01701977505', BloodGroup: 'B+', Department: '', Session: '' },
  { Name: 'আশিকুর রহমান', Phone: '01568952203', BloodGroup: 'B+', Department: '', Session: '' },
  { Name: 'নাজমুল', Phone: '01993650490', BloodGroup: 'B+', Department: '', Session: '' },
  { Name: 'বিথীকা', Phone: '01304260662', BloodGroup: 'B+', Department: '', Session: '' },
  { Name: 'রুকু', Phone: '01612206243', BloodGroup: 'B+', Department: '', Session: '' },
  { Name: 'নাজিউর', Phone: '01862263304', BloodGroup: 'B+', Department: '', Session: '' },
  { Name: 'কাউসার', Phone: '01403917026', BloodGroup: 'B+', Department: '', Session: '' },
  { Name: 'বপা', Phone: '01533958090', BloodGroup: 'B+', Department: '', Session: '' },
  { Name: 'জিনারুল', Phone: '01786739457', BloodGroup: 'B+', Department: '', Session: '' },
  { Name: 'রাখি', Phone: '01861518474', BloodGroup: 'B+', Department: '', Session: '' },
  { Name: 'জায়েদ', Phone: '01756006896', BloodGroup: 'B+', Department: '', Session: '' },
  { Name: 'মারুফ', Phone: '01778516036', BloodGroup: 'B+', Department: '', Session: '' },
  { Name: 'সমির বিশ্বাস', Phone: '01920129742', BloodGroup: 'B+', Department: '', Session: '' },
  { Name: 'মাহেদ', Phone: '01307327692', BloodGroup: 'B+', Department: '', Session: '' },
  { Name: 'রবিউল ইসলাম', Phone: '01748520818', BloodGroup: 'B+', Department: '', Session: '' },
  { Name: 'কিশোর বিশ্বাস', Phone: '01608490351', BloodGroup: 'B+', Department: '', Session: '' },
  { Name: 'মোহাম্মদ হোসেন', Phone: '01765500760', BloodGroup: 'B+', Department: '', Session: '' },
  { Name: 'কামরুন্নাহার', Phone: '01642781080', BloodGroup: 'B+', Department: '', Session: '' },
  { Name: 'ইমাম হোসেন রাকিব', Phone: '01638534765', BloodGroup: 'B+', Department: '', Session: '' },
  { Name: 'নাহিদ হোসেন', Phone: '01777824286', BloodGroup: 'B+', Department: '', Session: '' },

  // Page 5 (O+)
  { Name: 'সুমন', Phone: '01700533421', BloodGroup: 'O+', Department: 'BMB', Session: '22-23' },
  { Name: 'আশিবা', Phone: '01861254867', BloodGroup: 'O+', Department: 'BMB', Session: '22-23' },
  { Name: 'সামিয়া', Phone: '01920036784', BloodGroup: 'O+', Department: 'BGE', Session: '22-23' },
  { Name: 'রামিম', Phone: '01728203820', BloodGroup: 'O+', Department: 'BGE', Session: '22-23' },
  { Name: 'মিতু', Phone: '01870146607', BloodGroup: 'O+', Department: 'BGE', Session: '22-23' },
  { Name: 'Riad', Phone: '01889892630', BloodGroup: 'O+', Department: 'FE', Session: '22-23' },
  { Name: 'Shahriar', Phone: '01771778964', BloodGroup: 'O+', Department: 'FE', Session: '22-23' },
  { Name: 'Shoun', Phone: '01785362558', BloodGroup: 'O+', Department: 'FE', Session: '22-23' },
  { Name: 'Sazid', Phone: '01974204230', BloodGroup: 'O+', Department: 'AIS', Session: '22-23' },
  { Name: 'Megahid', Phone: '01921121754', BloodGroup: 'O+', Department: 'AIS', Session: '22-23' },
  { Name: 'Hasan', Phone: '01732837685', BloodGroup: 'O+', Department: 'AIS', Session: '22-23' },
  { Name: 'Mahi', Phone: '01784274400', BloodGroup: 'O+', Department: 'AIS', Session: '22-23' },
  { Name: 'শান্তা', Phone: '01846834281', BloodGroup: 'O+', Department: 'AIS', Session: '22-23' },
  { Name: 'মোহনা', Phone: '01711269934', BloodGroup: 'O+', Department: 'AIS', Session: '22-23' },
  { Name: 'মানিক', Phone: '01889348689', BloodGroup: 'O+', Department: 'AIS', Session: '22-23' },
  { Name: 'শাকিবুল', Phone: '01306882044', BloodGroup: 'O+', Department: 'AIS', Session: '22-23' },
  { Name: 'রুহামা ধর', Phone: '01319585368', BloodGroup: 'O+', Department: 'PS', Session: '22-23' },
  { Name: 'ঋতু', Phone: '01308281788', BloodGroup: 'O+', Department: 'PS', Session: '22-23' },
  { Name: 'তানিয়া', Phone: '01757845058', BloodGroup: 'O+', Department: 'PS', Session: '22-23' },
  { Name: 'সাদিয়া', Phone: '01963359709', BloodGroup: 'O+', Department: 'PS', Session: '22-23' },
  { Name: 'সুমাইয়া', Phone: '01876824735', BloodGroup: 'O+', Department: 'PS', Session: '22-23' },
  { Name: 'তুরিন রাহমান', Phone: '01304443085', BloodGroup: 'O+', Department: 'PS', Session: '22-23' },
  { Name: 'দিপু মোল্লা', Phone: '01827501045', BloodGroup: 'O+', Department: 'PS', Session: '22-23' },
  { Name: 'সায়ব সোম', Phone: '01918640533', BloodGroup: 'O+', Department: 'PS', Session: '22-23' },
];

async function main() {
  // 1. Create an Excel file
  const worksheet = xlsx.utils.json_to_sheet(rawData);
  const workbook = xlsx.utils.book_new();
  xlsx.utils.book_append_sheet(workbook, worksheet, 'Donors');
  
  // Save to public folder so it can be downloaded
  fs.writeFileSync('public/donors_extracted.xlsx', xlsx.write(workbook, { type: 'buffer', bookType: 'xlsx' }));
  
  console.log('Successfully created public/donors_extracted.xlsx with ' + rawData.length + ' entries.');
  
  // 2. Insert into Database via Prisma
  const Database = require('better-sqlite3');
  const { PrismaBetterSqlite3 } = require('@prisma/adapter-better-sqlite3');
  const { PrismaClient } = require('@prisma/client');

  const sqlite = new Database('dev.db');
  const adapter = new PrismaBetterSqlite3(sqlite);
  const prisma = new PrismaClient({ adapter });
  
  let addedCount = 0;
  for (const row of rawData) {
    try {
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
                department: row.Department || null,
                session: row.Session || null,
              }
            }
          }
        });
        addedCount++;
      }
    } catch (err) {
      console.error('Error inserting row', row, err.message);
    }
  }
  console.log('Successfully added ' + addedCount + ' new donors to the database.');
  
  await prisma.$disconnect();
}

main().catch(console.error);
