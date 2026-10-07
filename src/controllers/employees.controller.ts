import type { Request, Response } from 'express';
import { toEmployee } from '../mappers/employee.mapper';
import { insertEmployee } from '../repositories/employees.repository';
import { createEmployeeSchema } from '../schemas/employee.schema';

export async function createEmployee(req: Request, res: Response): Promise<void> {
  const input = createEmployeeSchema.parse(req.body);
  const row = await insertEmployee(input);

  res.status(201).location(`/api/employees/${row.id}`).json(toEmployee(row));
}
