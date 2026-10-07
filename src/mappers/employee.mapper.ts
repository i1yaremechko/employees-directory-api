import type { EmployeeRow } from '../repositories/employees.repository';
import type { Employee, EmployeePosition, EmployeeStatus } from '../types/employee';
import { formatBirthDate } from '../utils/date';

export function toEmployee(row: EmployeeRow): Employee {
  return {
    id: row.id,
    createdDate: Math.floor(row.created_at.getTime() / 1000),
    firstName: row.first_name,
    lastName: row.last_name,
    email: row.email,
    phone: row.phone,
    birthDate: formatBirthDate(row.birth_date),
    position: row.position as EmployeePosition,
    status: row.status as EmployeeStatus,
    tag: row.tag,
    avatarUrl: row.avatar_url,
  };
}
