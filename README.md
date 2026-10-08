# Employees Directory API

REST API (CRUD) for the [Employees Directory](https://github.com/i1yaremechko/employees-directory) project.

## Tech Stack

- Node.js, Express 5, TypeScript
- PostgreSQL 17 (Docker Compose), `pg` driver
- zod (validation)
- ESLint, Prettier, Husky, lint-staged

## Requirements

- Node.js 22 or newer
- Docker Desktop (for PostgreSQL)

## Quick Start

```bash
npm install
cp .env.example .env     # Windows cmd: copy .env.example .env
docker compose up -d     # start PostgreSQL
npm run migrate          # create tables
npm run seed             # optional: add 3 sample employees
npm run dev              # http://localhost:3000
```

The database listens on `127.0.0.1:55432`, so it does not clash with a PostgreSQL installed on the host.

## Environment Variables

| Variable       | Default                 | Description                                  |
| -------------- | ----------------------- | -------------------------------------------- |
| `PORT`         | `3000`                  | HTTP port                                    |
| `NODE_ENV`     | `development`           | Environment name                             |
| `CORS_ORIGIN`  | `http://localhost:5173` | Allowed frontend origin (scheme, host, port) |
| `DATABASE_URL` | required                | PostgreSQL connection string                 |

## Scripts

| Script              | Description                              |
| ------------------- | ---------------------------------------- |
| `npm run dev`       | Start the server with auto-reload        |
| `npm run build`     | Compile TypeScript to `dist/`            |
| `npm start`         | Run the compiled server                  |
| `npm run migrate`   | Apply new SQL files from `migrations/`   |
| `npm run seed`      | Insert sample employees (safe to re-run) |
| `npm run typecheck` | Type-check without emitting files        |
| `npm run lint`      | Run ESLint                               |
| `npm run format`    | Format the code with Prettier            |

## API

Base path: `/api`

| Method   | Path             | Description             | Success | Errors              |
| -------- | ---------------- | ----------------------- | ------- | ------------------- |
| `GET`    | `/health`        | API and database status | `200`   | `503`               |
| `GET`    | `/employees`     | List employees          | `200`   | `400`               |
| `GET`    | `/employees/:id` | Get one employee        | `200`   | `400`, `404`        |
| `POST`   | `/employees`     | Create an employee      | `201`   | `400`, `409`        |
| `PUT`    | `/employees/:id` | Replace an employee     | `200`   | `400`, `404`, `409` |
| `DELETE` | `/employees/:id` | Delete an employee      | `204`   | `400`, `404`        |

### Employee object

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
- `status`: `ACTIVE`, `INACTIVE`
- `birthDate`: `DD.MM.YYYY`, a real date between 01.01.1900 and today
- `createdDate`: Unix time in seconds
- `tag`: string or `null`

### Create and update

`POST` requires `firstName`, `lastName`, `email`, `phone`, `birthDate` and `position`. `status` defaults to `ACTIVE`, `avatarUrl` defaults to an empty string, `tag` is optional.

`PUT` replaces the whole record, so every field except `tag` is required. `id` and `createdDate` in the body are ignored. Email must be unique, case-insensitive.

### List query parameters

All parameters are optional.

| Parameter  | Example                         | Description                                                  |
| ---------- | ------------------------------- | ------------------------------------------------------------ |
| `search`   | `?search=alex`                  | Case-insensitive match in full name, email and tag           |
| `position` | `?position=DEVELOPER,DESIGNER`  | One or several positions, comma-separated                    |
| `status`   | `?status=ACTIVE`                | Filter by status                                             |
| `sort`     | `?sort=alphabet` or `birthDate` | Sorting; by default the newest employees come first          |
| `order`    | `?order=desc`                   | Sort direction (`asc` by default), used together with `sort` |

### Errors

Validation errors (`400`):

```json
{
  "message": "Validation failed",
  "errors": [{ "field": "email", "message": "Invalid email address" }]
}
```

Other errors have the form `{ "message": "..." }`.

## Project Structure

```
migrations/      SQL migrations (applied in file name order)
src/
  config/        environment variables
  controllers/   request handlers
  db/            connection pool, migration runner, seed
  errors/        HttpError
  mappers/       database row -> API object
  middlewares/   404 and error handlers
  repositories/  SQL queries
  routes/        route definitions
  schemas/       zod validation schemas
  types/         shared types
  utils/         date helpers
```

## Database

Migrations live in `migrations/` as numbered SQL files. Applied files are tracked in the `schema_migrations` table and are never edited afterwards. A schema change is always a new file.

```bash
docker compose stop          # stop the database, data is kept
docker compose down -v       # remove the database together with its data
```
