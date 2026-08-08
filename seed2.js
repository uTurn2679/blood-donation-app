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
    // PAD (Public Administration)
    { Name: 'মাছুরা', Phone: '01317074062', BloodGroup: 'O+', Department: 'PAD', Session: '23-24' },
    { Name: 'মেহেরুন', Phone: '01331574228', BloodGroup: 'A-', Department: 'PAD', Session: '23-24' },
    { Name: 'নাজমিন আক্তার', Phone: '01950232972', BloodGroup: 'O+', Department: 'PAD', Session: '23-24' },
    { Name: 'আদিবা খানম', Phone: '01951527937', BloodGroup: 'B+', Department: 'PAD', Session: '23-24' },
    { Name: 'আজমিরা পারভীন', Phone: '01331537451', BloodGroup: 'A+', Department: 'PAD', Session: '23-24' },
    { Name: 'সুমাইয়া আক্তার', Phone: '01790938855', BloodGroup: 'B+', Department: 'PAD', Session: '23-24' },
    { Name: 'ফাতিহা তাসনিম', Phone: '01789318398', BloodGroup: 'O+', Department: 'PAD', Session: '23-24' },
    { Name: 'জান্নাতুন নিহা', Phone: '01925318531', BloodGroup: 'O+', Department: 'PAD', Session: '23-24' },
    { Name: 'ফাতেমা আক্তার রশী', Phone: '01757537068', BloodGroup: 'AB+', Department: 'PAD', Session: '23-24' },
    { Name: 'সুমাইয়া খানম', Phone: '01985221044', BloodGroup: 'O+', Department: 'PAD', Session: '23-24' },
    { Name: 'অনিমা আক্তার', Phone: '01861979830', BloodGroup: 'B+', Department: 'PAD', Session: '23-24' },
    { Name: 'মোহনা আক্তার', Phone: '01930178193', BloodGroup: 'O+', Department: 'PAD', Session: '23-24' },
    { Name: 'আসমা বিনতে হাশেম', Phone: '01619212500', BloodGroup: 'B+', Department: 'PAD', Session: '23-24' },
    { Name: 'নুসরাত জাহান জেসি', Phone: '01306889883', BloodGroup: 'O+', Department: 'PAD', Session: '23-24' },
    { Name: 'নুসরাত জাহান', Phone: '01946661843', BloodGroup: 'O+', Department: 'PAD', Session: '23-24' },
    { Name: 'বর্ষা বিশ্বাস', Phone: '01306802718', BloodGroup: 'O+', Department: 'PAD', Session: '23-24' },

    // CSE (Computer Science and Engineering)
    { Name: 'Md. Mehedi Haque', Phone: '01780723714', BloodGroup: 'AB+', Department: 'CSE', Session: '23-24' },
    { Name: 'Md. Asif Mahmud', Phone: '01748708766', BloodGroup: 'O+', Department: 'CSE', Session: '23-24' },
    { Name: 'Sayed Hridoy', Phone: '01989519867', BloodGroup: 'B+', Department: 'CSE', Session: '23-24' },
    { Name: 'Abu Kawsar', Phone: '01812914245', BloodGroup: 'B+', Department: 'CSE', Session: '23-24' },
    { Name: 'ANISUR', Phone: '01616414541', BloodGroup: 'B+', Department: 'CSE', Session: '23-24' },
    { Name: 'Redwan', Phone: '01306875451', BloodGroup: 'A+', Department: 'CSE', Session: '23-24' },
    { Name: 'Hasibur Rahman', Phone: '01324856383', BloodGroup: 'B+', Department: 'CSE', Session: '23-24' },
    { Name: 'Golam Mowla', Phone: '01746783727', BloodGroup: 'O+', Department: 'CSE', Session: '23-24' },
    { Name: 'Md. Miftahul', Phone: '01777493497', BloodGroup: 'O+', Department: 'CSE', Session: '23-24' },
    { Name: 'Abdullah', Phone: '01798246847', BloodGroup: 'A+', Department: 'CSE', Session: '23-24' },
    { Name: 'Abu Hasan', Phone: '01961200212', BloodGroup: 'O+', Department: 'CSE', Session: '23-24' },
    { Name: 'Jay', Phone: '01789495406', BloodGroup: 'O+', Department: 'CSE', Session: '23-24' },
    { Name: 'Sattwik', Phone: '01706928138', BloodGroup: 'B+', Department: 'CSE', Session: '23-24' },
    { Name: 'Jagannath', Phone: '01560020958', BloodGroup: 'AB+', Department: 'CSE', Session: '23-24' },
    { Name: 'Md. Samiul Islam omio', Phone: '01883238358', BloodGroup: 'O+', Department: 'CSE', Session: '23-24' },
    { Name: 'Indronil', Phone: '01715692065', BloodGroup: 'O+', Department: 'CSE', Session: '23-24' },
    { Name: 'Asadul Islam', Phone: '01608564319', BloodGroup: 'O+', Department: 'CSE', Session: '23-24' },
    { Name: 'Abu Ekram', Phone: '01608170859', BloodGroup: 'B+', Department: 'CSE', Session: '23-24' },
    { Name: 'Al-mamun', Phone: '01320648443', BloodGroup: 'A+', Department: 'CSE', Session: '23-24' },
    { Name: 'Aronob Roy', Phone: '01739174044', BloodGroup: 'AB+', Department: 'CSE', Session: '23-24' },
    { Name: 'Tasnim Jahan', Phone: '01960495208', BloodGroup: 'B+', Department: 'CSE', Session: '23-24' },
    { Name: 'Munira Khondokar', Phone: '01876541001', BloodGroup: 'O+', Department: 'CSE', Session: '23-24' },
    { Name: 'Ayesha Akter', Phone: '01701977505', BloodGroup: 'AB-', Department: 'CSE', Session: '23-24' },
    { Name: 'Shuhib Hasan', Phone: '01818548349', BloodGroup: 'B+', Department: 'CSE', Session: '23-24' },
    { Name: 'Topon chandra', Phone: '01770017306', BloodGroup: 'A+', Department: 'CSE', Session: '23-24' },
    { Name: 'Aninda Raj', Phone: '01751548084', BloodGroup: 'A+', Department: 'CSE', Session: '23-24' },
    { Name: 'Tuhin Biswas', Phone: '01676610125', BloodGroup: 'O+', Department: 'CSE', Session: '23-24' },
    { Name: 'Mrinmoy Ahamed', Phone: '01929567730', BloodGroup: 'B+', Department: 'CSE', Session: '23-24' },
    { Name: 'Md Anik Hasan', Phone: '01871149041', BloodGroup: 'B+', Department: 'CSE', Session: '23-24' },
    { Name: 'Sourav Biswas', Phone: '01701792085', BloodGroup: 'B+', Department: 'CSE', Session: '23-24' },
    { Name: 'Feroz Ali Ashok', Phone: '01861867206', BloodGroup: 'AB+', Department: 'CSE', Session: '23-24' },
    { Name: 'Tuhin Kumar Datta', Phone: '01845662887', BloodGroup: 'B+', Department: 'CSE', Session: '23-24' },

    // MGT (Management Studies)
    { Name: 'সিফাত', Phone: '01308752684', BloodGroup: 'A+', Department: 'MGT', Session: '23-24' },
    { Name: 'সিয়াম', Phone: '01816325746', BloodGroup: 'B+', Department: 'MGT', Session: '23-24' },
    { Name: 'তাকিম', Phone: '01796638543', BloodGroup: 'A+', Department: 'MGT', Session: '23-24' },
    { Name: 'খাইরুজ্জামান', Phone: '01303585054', BloodGroup: 'B+', Department: 'MGT', Session: '23-24' },
    { Name: 'কুশল বাড়ৈ', Phone: '01406085141', BloodGroup: 'O+', Department: 'MGT', Session: '23-24' },
    { Name: 'রাতুল', Phone: '01778397493', BloodGroup: 'O+', Department: 'MGT', Session: '23-24' },
    { Name: 'রনি', Phone: '01836360983', BloodGroup: 'O+', Department: 'MGT', Session: '23-24' },
    { Name: 'ইমন', Phone: '01644898457', BloodGroup: 'O+', Department: 'MGT', Session: '23-24' },
    { Name: 'অলি আহম্মেদ', Phone: '01817897481', BloodGroup: 'O+', Department: 'MGT', Session: '23-24' },
    { Name: 'মুসফিকুর', Phone: '01600818712', BloodGroup: 'B+', Department: 'MGT', Session: '23-24' },
    { Name: 'ইসমাইল', Phone: '01816077991', BloodGroup: 'A+', Department: 'MGT', Session: '23-24' },
    { Name: 'রাশিদুল', Phone: '01716022073', BloodGroup: 'O+', Department: 'MGT', Session: '23-24' },
    { Name: 'বিশাল', Phone: '01790680211', BloodGroup: 'B+', Department: 'MGT', Session: '23-24' },
    { Name: 'নওরিন', Phone: '01894919534', BloodGroup: 'O+', Department: 'MGT', Session: '23-24' },
    { Name: 'রিমু', Phone: '01915232232', BloodGroup: 'B+', Department: 'MGT', Session: '23-24' },
    { Name: 'রিফাত', Phone: '01761136409', BloodGroup: 'A+', Department: 'MGT', Session: '23-24' },
    { Name: 'বুলবুল', Phone: '01743372979', BloodGroup: 'A+', Department: 'MGT', Session: '23-24' },
    { Name: 'হিশাম', Phone: '01533349716', BloodGroup: 'A+', Department: 'MGT', Session: '23-24' },

    // English (Department of English)
    { Name: 'আনিকা', Phone: '01823406890', BloodGroup: 'B+', Department: 'English', Session: '23-24' },
    { Name: 'অদনা ইসলাম', Phone: '01879289008', BloodGroup: 'O+', Department: 'English', Session: '23-24' },
    { Name: 'মাদিহাতুন জান্নাত', Phone: '01612007919', BloodGroup: 'O-', Department: 'English', Session: '23-24' },
    { Name: 'জ্যোতি খাতুন', Phone: '01332677865', BloodGroup: 'A+', Department: 'English', Session: '23-24' },
    { Name: 'নীলিমা', Phone: '01988949002', BloodGroup: 'B+', Department: 'English', Session: '23-24' },
    { Name: 'সুমাইয়া', Phone: '01755920919', BloodGroup: 'B+', Department: 'English', Session: '23-24' },
    { Name: 'সালমা', Phone: '01895478622', BloodGroup: 'O+', Department: 'English', Session: '23-24' },
    { Name: 'স্নেহা', Phone: '01735314283', BloodGroup: 'B+', Department: 'English', Session: '23-24' },
    { Name: 'Sourov', Phone: '01715308280', BloodGroup: 'A+', Department: 'English', Session: '23-24' },
    { Name: 'Nusrat', Phone: '01888145736', BloodGroup: 'O+', Department: 'English', Session: '23-24' },
    { Name: 'Marzifur', Phone: '01758119821', BloodGroup: 'A+', Department: 'English', Session: '23-24' },
    { Name: 'Ahaduzzaman', Phone: '01312882289', BloodGroup: 'B+', Department: 'English', Session: '23-24' },
    { Name: 'Nabil', Phone: '01893441473', BloodGroup: 'O+', Department: 'English', Session: '23-24' },
    { Name: 'Abdullah', Phone: '01757706737', BloodGroup: 'O+', Department: 'English', Session: '23-24' },
    { Name: 'রতন বাছাড় দেব', Phone: '01785035040', BloodGroup: 'A+', Department: 'English', Session: '23-24' },
    { Name: 'Kamrul', Phone: '01776822337', BloodGroup: 'O+', Department: 'English', Session: '23-24' },
    { Name: 'Alauddin', Phone: '01884854140', BloodGroup: 'B+', Department: 'English', Session: '23-24' },
    { Name: 'Ratul', Phone: '01751500680', BloodGroup: 'B+', Department: 'English', Session: '23-24' },
    { Name: 'সাইয়ারা', Phone: '01713552110', BloodGroup: 'O+', Department: 'English', Session: '23-24' },
    { Name: 'Afsana Tasnim', Phone: '01745413232', BloodGroup: 'A+', Department: 'English', Session: '23-24' },
    { Name: 'Sayma', Phone: '01783086095', BloodGroup: 'B+', Department: 'English', Session: '23-24' },
    { Name: 'Anika Jahin', Phone: '01967406949', BloodGroup: 'A+', Department: 'English', Session: '23-24' },
    { Name: 'Purnabi Kawsar', Phone: '01973134923', BloodGroup: 'A+', Department: 'English', Session: '23-24' },
    { Name: 'Layeba Tasnim', Phone: '01302072502', BloodGroup: 'O+', Department: 'English', Session: '23-24' },
    { Name: 'Tastia', Phone: '01717347554', BloodGroup: 'O+', Department: 'English', Session: '23-24' }
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
  console.log('Added ' + addedCount + ' new donors from batch 2.');
}
main().catch(console.error).finally(() => process.exit(0));
