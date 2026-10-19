import { Router } from 'express';
import { pool } from '../db/pool';

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

const COLUMNS =
  'first_name, last_name, email, phone, birth_date, position, status, tag, avatar_url';

const VALUES = `
  btrim($1), btrim($2), lower(btrim($3)), btrim($4), to_date($5, 'DD.MM.YYYY'),
  $6::text, COALESCE($7, 'ACTIVE'), NULLIF(btrim($8), ''), COALESCE(btrim($9), '')
`;

function toParams(body: Record<string, unknown> = {}) {
  return [
    body.firstName,
    body.lastName,
    body.email,
    body.phone,
    body.birthDate,
    body.position,
    body.status,
    body.tag,
    body.avatarUrl,
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
  const { rows } = await pool.query(`SELECT ${SELECT_FIELDS} FROM employees WHERE id = $1`, [
    req.params.id,
  ]);

  if (rows.length === 0) {
    res.status(404).json({ message: 'Employee not found' });
    return;
  }

  res.json(rows[0]);
});

employeesRouter.post('/', async (req, res) => {
  const { rows } = await pool.query(
    `INSERT INTO employees (${COLUMNS}) VALUES (${VALUES}) RETURNING ${SELECT_FIELDS}`,
    toParams(req.body)
  );

  res.status(201).location(`/api/employees/${rows[0].id}`).json(rows[0]);
});

employeesRouter.put('/:id', async (req, res) => {
  const { rows } = await pool.query(
    `UPDATE employees SET (${COLUMNS}) = (${VALUES}) WHERE id = $10 RETURNING ${SELECT_FIELDS}`,
    [...toParams(req.body), req.params.id]
  );

  if (rows.length === 0) {
    res.status(404).json({ message: 'Employee not found' });
    return;
  }

  res.json(rows[0]);
});

employeesRouter.delete('/:id', async (req, res) => {
  const { rowCount } = await pool.query('DELETE FROM employees WHERE id = $1', [req.params.id]);

  if (rowCount === 0) {
    res.status(404).json({ message: 'Employee not found' });
    return;
  }

  res.status(204).send();
});
