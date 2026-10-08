import type { Request, Response } from 'express';
import { HttpError } from '../errors/HttpError';
import { toEmployee } from '../mappers/employee.mapper';
import {
  deleteEmployee as deleteEmployeeRow,
  findAllEmployees,
  findEmployeeById,
  insertEmployee,
  updateEmployee as updateEmployeeRow,
} from '../repositories/employees.repository';
import {
  createEmployeeSchema,
  employeeParamsSchema,
  updateEmployeeSchema,
} from '../schemas/employee.schema';

export async function createEmployee(req: Request, res: Response): Promise<void> {
  const input = createEmployeeSchema.parse(req.body);
  const row = await insertEmployee(input);

  res.status(201).location(`/api/employees/${row.id}`).json(toEmployee(row));
}

export async function getEmployees(_req: Request, res: Response): Promise<void> {
  const rows = await findAllEmployees();

  res.json(rows.map(toEmployee));
}

export async function getEmployeeById(req: Request, res: Response): Promise<void> {
  const { id } = employeeParamsSchema.parse(req.params);
  const row = await findEmployeeById(id);

  if (!row) {
    throw new HttpError(404, 'Employee not found');
  }

  res.json(toEmployee(row));
}

export async function updateEmployee(req: Request, res: Response): Promise<void> {
  const { id } = employeeParamsSchema.parse(req.params);
  const input = updateEmployeeSchema.parse(req.body);
  const row = await updateEmployeeRow(id, input);

  if (!row) {
    throw new HttpError(404, 'Employee not found');
  }

  res.json(toEmployee(row));
}

export async function deleteEmployee(req: Request, res: Response): Promise<void> {
  const { id } = employeeParamsSchema.parse(req.params);
  const isDeleted = await deleteEmployeeRow(id);

  if (!isDeleted) {
    throw new HttpError(404, 'Employee not found');
  }

  res.status(204).send();
}
