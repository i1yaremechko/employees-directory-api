INSERT INTO employees
  (first_name, last_name, email, phone, birth_date, position, status, tag, avatar_url, created_at)
VALUES
  ('Alex', 'Cooper', 'alex.cooper@gmail.com', '+1-102-666-2233', '1999-10-12',
   'DEVELOPER', 'ACTIVE', 'Front-end',
   'https://bionic-university.s3.eu-central-1.amazonaws.com/projects/employees-directory/alex-cooper-av.jpg',
   to_timestamp(1761117250)),
  ('Alice', 'Ivaniy', 'a.ivaniy@ukr.net', '+38-050-333-2200', '2000-02-04',
   'DESIGNER', 'ACTIVE', 'AI skills',
   'https://bionic-university.s3.eu-central-1.amazonaws.com/projects/employees-directory/alice-ivaniy-av.jpg',
   to_timestamp(1761117190)),
  ('Briel', 'Dubois', 'gabr@proton.me', '+33-109-758-2233', '1990-08-01',
   'MANAGER', 'ACTIVE', NULL,
   'https://bionic-university.s3.eu-central-1.amazonaws.com/projects/employees-directory/briel-dubois-av.jpg',
   to_timestamp(1761117130));