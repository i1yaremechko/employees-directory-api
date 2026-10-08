import { Router } from 'express';
import {
  createEmployee,
  deleteEmployee,
  getEmployeeById,
  getEmployees,
  updateEmployee,
} from '../controllers/employees.controller';

export const employeesRouter = Router();

employeesRouter.get('/', getEmployees);
employeesRouter.get('/:id', getEmployeeById);
employeesRouter.post('/', createEmployee);
employeesRouter.put('/:id', updateEmployee);
employeesRouter.delete('/:id', deleteEmployee);
