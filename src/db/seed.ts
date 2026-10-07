import { closeDbPool, pool } from './pool';

interface SeedEmployee {
  createdDate: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  birthDate: string;
  position: string;
  status: string;
  tag: string | null;
  avatarUrl: string;
}

const employees: SeedEmployee[] = [
  {
    createdDate: 1761117250,
    firstName: 'Alex',
    lastName: 'Cooper',
    email: 'alex.cooper@gmail.com',
    phone: '+1-102-666-2233',
    birthDate: '1999-10-12',
    position: 'DEVELOPER',
    status: 'ACTIVE',
    tag: 'Front-end',
    avatarUrl:
      'https://bionic-university.s3.eu-central-1.amazonaws.com/projects/employees-directory/alex-cooper-av.jpg',
  },
  {
    createdDate: 1761117190,
    firstName: 'Alice',
    lastName: 'Ivaniy',
    email: 'a.ivaniy@ukr.net',
    phone: '+38-050-333-2200',
    birthDate: '2000-02-04',
    position: 'DESIGNER',
    status: 'ACTIVE',
    tag: 'AI skills',
    avatarUrl:
      'https://bionic-university.s3.eu-central-1.amazonaws.com/projects/employees-directory/alice-ivaniy-av.jpg',
  },
  {
    createdDate: 1761117130,
    firstName: 'Briel',
    lastName: 'Dubois',
    email: 'gabr@proton.me',
    phone: '+33-109-758-2233',
    birthDate: '1990-08-01',
    position: 'MANAGER',
    status: 'ACTIVE',
    tag: null,
    avatarUrl:
      'https://bionic-university.s3.eu-central-1.amazonaws.com/projects/employees-directory/briel-dubois-av.jpg',
  },
];

async function seed(): Promise<void> {
  let inserted = 0;

  for (const employee of employees) {
    const result = await pool.query(
      `INSERT INTO employees
         (first_name, last_name, email, phone, birth_date, position, status, tag, avatar_url, created_at)
       VALUES
         ($1, $2, $3, $4, $5, $6, $7, $8, $9, to_timestamp($10))
       ON CONFLICT DO NOTHING`,
      [
        employee.firstName,
        employee.lastName,
        employee.email,
        employee.phone,
        employee.birthDate,
        employee.position,
        employee.status,
        employee.tag,
        employee.avatarUrl,
        employee.createdDate,
      ]
    );

    inserted += result.rowCount ?? 0;
  }

  console.log(`Seed finished: ${inserted} inserted, ${employees.length - inserted} skipped`);
}

seed()
  .then(() => closeDbPool())
  .catch(async (error) => {
    console.error('Seed failed:', error);
    await closeDbPool();
    process.exit(1);
  });
