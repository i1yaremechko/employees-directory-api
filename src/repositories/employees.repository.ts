import { pool } from '../db/pool';
import type { CreateEmployeeInput } from '../schemas/employee.schema';

export interface EmployeeRow {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  birth_date: string;
  position: string;
  status: string;
  tag: string | null;
  avatar_url: string;
  created_at: Date;
}

export const EMPLOYEE_COLUMNS = `
  id, first_name, last_name, email, phone, birth_date,
  position, status, tag, avatar_url, created_at
`;

export async function insertEmployee(input: CreateEmployeeInput): Promise<EmployeeRow> {
  const { rows } = await pool.query<EmployeeRow>(
    `INSERT INTO employees
       (first_name, last_name, email, phone, birth_date, position, status, tag, avatar_url)
     VALUES
       ($1, $2, $3, $4, $5, $6, $7, $8, $9)
     RETURNING ${EMPLOYEE_COLUMNS}`,
    [
      input.firstName,
      input.lastName,
      input.email,
      input.phone,
      input.birthDate,
      input.position,
      input.status,
      input.tag,
      input.avatarUrl,
    ]
  );

  return rows[0];
}

export async function findAllEmployees(): Promise<EmployeeRow[]> {
  const { rows } = await pool.query<EmployeeRow>(
    `SELECT ${EMPLOYEE_COLUMNS}
     FROM employees
     ORDER BY created_at DESC, id`
  );

  return rows;
}

export async function findEmployeeById(id: string): Promise<EmployeeRow | null> {
  const { rows } = await pool.query<EmployeeRow>(
    `SELECT ${EMPLOYEE_COLUMNS}
     FROM employees
     WHERE id = $1`,
    [id]
  );

  return rows[0] ?? null;
}
