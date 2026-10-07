import { z } from 'zod';
import { EMPLOYEE_POSITIONS, EMPLOYEE_STATUSES } from '../types/employee';
import { parseBirthDate, todayIso } from '../utils/date';

const nameSchema = z.string().trim().min(1).max(50);

const emailSchema = z.string().trim().max(254).pipe(z.email());

const phoneSchema = z
  .string()
  .trim()
  .regex(/^\+?[0-9\s\-()]{7,20}$/, 'phone must contain 7-20 digits, spaces, dashes or brackets');

const birthDateSchema = z
  .string()
  .trim()
  .transform((value, ctx) => {
    const iso = parseBirthDate(value);

    if (!iso || iso < '1900-01-01' || iso > todayIso()) {
      ctx.addIssue({
        code: 'custom',
        message: 'birthDate must be a real date in DD.MM.YYYY format, from 01.01.1900 until today',
      });
      return z.NEVER;
    }

    return iso;
  });

const tagSchema = z
  .string()
  .trim()
  .max(50)
  .nullish()
  .transform((value) => value || null);

const avatarUrlSchema = z
  .string()
  .trim()
  .max(2048)
  .refine((value) => value === '' || /^https?:\/\//i.test(value), {
    message: 'avatarUrl must be an http(s) URL',
  })
  .optional()
  .default('');

export const createEmployeeSchema = z.object({
  firstName: nameSchema,
  lastName: nameSchema,
  email: emailSchema,
  phone: phoneSchema,
  birthDate: birthDateSchema,
  position: z.enum(EMPLOYEE_POSITIONS),
  status: z.enum(EMPLOYEE_STATUSES).default('ACTIVE'),
  tag: tagSchema,
  avatarUrl: avatarUrlSchema,
});

export type CreateEmployeeInput = z.infer<typeof createEmployeeSchema>;
