import { Router } from 'express';
import { createEmployee, getEmployeeById, getEmployees } from '../controllers/employees.controller';

export const employeesRouter = Router();

employeesRouter.get('/', getEmployees);
employeesRouter.get('/:id', getEmployeeById);
employeesRouter.post('/', createEmployee);
