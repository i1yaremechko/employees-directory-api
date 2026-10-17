import { Router } from 'express';
import { pool } from '../db/pool';
import {
  employeeSchema,
  employeeParamsSchema,
  type employeeInput,
} from '../schemas/employee.schema';

const SELECT_FIELDS = `
  id,
  extract(epoch FROM created_at)::int AS "createdDate",
  first_name AS "firstName",
  last_name AS "lastName",
  email,
  phone,
  to_char(birth_date, 'DD.MM.YYYY') AS "birthDate",
  position,
  status,
  tag,
  avatar_url AS "avatarUrl"
`;

function toParams(e: employeeInput) {
  return [
    e.firstName,
    e.lastName,
    e.email,
    e.phone,
    e.birthDate,
    e.position,
    e.status,
    e.tag,
    e.avatarUrl,
  ];
}

export const employeesRouter = Router();

employeesRouter.get('/', async (_req, res) => {
  const { rows } = await pool.query(
    `SELECT ${SELECT_FIELDS} FROM employees ORDER BY created_at DESC, id`
  );

  res.json(rows);
});

employeesRouter.get('/:id', async (req, res) => {
  const { id } = employeeParamsSchema.parse(req.params);
  const { rows } = await pool.query(`SELECT ${SELECT_FIELDS} FROM employees WHERE id = $1`, [id]);

  if (rows.length === 0) {
    res.status(404).json({ message: 'Employee not found' });
    return;
  }

  res.json(rows[0]);
});

employeesRouter.post('/', async (req, res) => {
  const employee = employeeSchema.parse(req.body);
  const { rows } = await pool.query(
    `INSERT INTO employees
       (first_name, last_name, email, phone, birth_date, position, status, tag, avatar_url)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
     RETURNING ${SELECT_FIELDS}`,
    toParams(employee)
  );

  res.status(201).location(`/api/employees/${rows[0].id}`).json(rows[0]);
});

employeesRouter.put('/:id', async (req, res) => {
  const { id } = employeeParamsSchema.parse(req.params);
  const employee = employeeSchema.parse(req.body);
  const { rows } = await pool.query(
    `UPDATE employees
     SET first_name = $2, last_name = $3, email = $4, phone = $5, birth_date = $6,
         position = $7, status = $8, tag = $9, avatar_url = $10
     WHERE id = $1
     RETURNING ${SELECT_FIELDS}`,
    [id, ...toParams(employee)]
  );

  if (rows.length === 0) {
    res.status(404).json({ message: 'Employee not found' });
    return;
  }

  res.json(rows[0]);
});

employeesRouter.delete('/:id', async (req, res) => {
  const { id } = employeeParamsSchema.parse(req.params);
  const { rowCount } = await pool.query('DELETE FROM employees WHERE id = $1', [id]);

  if (rowCount === 0) {
    res.status(404).json({ message: 'Employee not found' });
    return;
  }

  res.status(204).send();
});
