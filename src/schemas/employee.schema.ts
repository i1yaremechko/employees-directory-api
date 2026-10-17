import { z } from 'zod';

const nameSchema = z.string().trim().min(1).max(50);
const emailSchema = z.string().trim().toLowerCase().pipe(z.email());
const phoneSchema = z
  .string()
  .trim()
  .regex(/^\+?[0-9\s\-()]{7,20}$/, 'phone must contain 7-20 digits, spaces, dashes or brackets');

const birthDateSchema = z
  .string()
  .trim()
  .transform((value, ctx) => {
    const match = /^(\d{2})\.(\d{2})\.(\d{4})$/.exec(value);
    const [day, month, year] = match ? match.slice(1).map(Number) : [];
    const date = new Date(Date.UTC(year, month - 1, day));
    const isRealDate =
      date.getUTCFullYear() === year &&
      date.getUTCMonth() === month - 1 &&
      date.getUTCDate() === day;

    if (!isRealDate || date > new Date()) {
      ctx.addIssue({
        code: 'custom',
        message: 'birthDate must be a real past date in DD.MM.YYYY format',
      });
      return z.NEVER;
    }

    return date.toISOString().slice(0, 10);
  });

const POSITIONS = ['DEVELOPER', 'DESIGNER', 'MANAGER', 'ANALYST', 'RECRUITER'] as const;
const STATUSES = ['ACTIVE', 'INACTIVE'] as const;

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
  });

export const employeeSchema = z.object({
  firstName: nameSchema,
  lastName: nameSchema,
  email: emailSchema,
  phone: phoneSchema,
  birthDate: birthDateSchema,
  position: z.enum(POSITIONS),
  status: z.enum(STATUSES).default('ACTIVE'),
  tag: tagSchema,
  avatarUrl: avatarUrlSchema.optional().default(''),
});

export const employeeParamsSchema = z.object({
  id: z.uuid({ message: 'id must be a valid UUID' }),
});

export type employeeInput = z.infer<typeof employeeSchema>;
