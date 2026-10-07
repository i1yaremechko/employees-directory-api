export const EMPLOYEE_POSITIONS = [
  'DEVELOPER',
  'DESIGNER',
  'MANAGER',
  'ANALYST',
  'RECRUITER',
] as const;

export const EMPLOYEE_STATUSES = ['ACTIVE', 'INACTIVE'] as const;

export type EmployeePosition = (typeof EMPLOYEE_POSITIONS)[number];

export type EmployeeStatus = (typeof EMPLOYEE_STATUSES)[number];

export interface Employee {
  id: string;
  createdDate: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  birthDate: string;
  position: EmployeePosition;
  status: EmployeeStatus;
  tag: string | null;
  avatarUrl: string;
}
