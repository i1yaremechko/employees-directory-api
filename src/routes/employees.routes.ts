import { Router } from 'express';
import { createEmployee } from '../controllers/employees.controller';

export const employeesRouter = Router();

employeesRouter.post('/', createEmployee);
