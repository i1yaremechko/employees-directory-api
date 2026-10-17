# Employees Directory API

REST API (CRUD) for the [Employees Directory](https://github.com/i1yaremechko/employees-directory) project.

**Stack:** Node.js, Express 5, TypeScript, PostgreSQL, zod.

## Quick Start

Requires Node.js 22+ and Docker.

```bash
npm install
cp .env.example .env     # Windows cmd: copy .env.example .env
docker compose up -d     # starts PostgreSQL, creates the table and sample data
npm run dev              # http://localhost:3000
```

On the first start the database container runs the files from `sql/`:
`01-schema.sql` creates the table, `02-seed.sql` adds three sample employees.
To recreate the database from scratch: `docker compose down -v && docker compose up -d`.

For a hosted database (e.g. Neon) run both SQL files once in its SQL editor.

## Environment Variables

| Variable       | Default                 | Description                       |
| -------------- | ----------------------- | --------------------------------- |
| `PORT`         | `3000`                  | HTTP port                         |
| `NODE_ENV`     | `development`           | Environment name                  |
| `CORS_ORIGIN`  | `http://localhost:5173` | Allowed frontend origin (no path) |
| `DATABASE_URL` | required                | PostgreSQL connection string      |

## API

| Method   | Path                 | Success | Errors              |
| -------- | -------------------- | ------- | ------------------- |
| `GET`    | `/api/health`        | `200`   | `503`               |
| `GET`    | `/api/employees`     | `200`   |                     |
| `GET`    | `/api/employees/:id` | `200`   | `400`, `404`        |
| `POST`   | `/api/employees`     | `201`   | `400`, `409`        |
| `PUT`    | `/api/employees/:id` | `200`   | `400`, `404`, `409` |
| `DELETE` | `/api/employees/:id` | `204`   | `400`, `404`        |

Employee object:

```json
{
  "id": "5b0c8c3e-6a4f-4f0e-9a52-0d1f3f6f2c11",
  "createdDate": 1761117250,
  "firstName": "Alex",
  "lastName": "Cooper",
  "email": "alex.cooper@gmail.com",
  "phone": "+1-102-666-2233",
  "birthDate": "12.10.1999",
  "position": "DEVELOPER",
  "status": "ACTIVE",
  "tag": "Front-end",
  "avatarUrl": "https://example.com/avatar.jpg"
}
```

- `position`: `DEVELOPER`, `DESIGNER`, `MANAGER`, `ANALYST`, `RECRUITER`
- `status`: `ACTIVE` (default), `INACTIVE`
- `birthDate`: `DD.MM.YYYY`; `createdDate`: Unix time in seconds
- Email is stored in lower case and must be unique (`409` otherwise)
- `POST` and `PUT` take the same body; `id` and `createdDate` are ignored. `PUT` replaces the whole record.
- Validation errors: `{ "message": "Validation failed", "errors": [{ "field": "email", "message": "..." }] }`

## Scripts

`npm run dev`, `npm run build`, `npm start`, `npm run typecheck`, `npm run lint`, `npm run format`
