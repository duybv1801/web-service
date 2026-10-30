# CLAUDE.md

This file gives Claude Code (claude.ai/code) guidance for working in this repository.

## Secrets: never read `.env` files

Never read, open, print, `cat`, `grep`, `source` or otherwise access the contents of any `.env` file (e.g. `rbac-app/backend/.env`), even when debugging configuration. Use `.env.example` to learn which variables exist. If you need a real value, ask the user instead.

## Deployment (GitHub Pages)

`.github/workflows/pages.yml` deploys static files to GitHub Pages on every push to `main`. You can also run it manually through `workflow_dispatch`. The workflow assembles `_site/` like this:
- the contents of `baitap01/` → site root
- `BaiTapCSS/` → `/BaiTapCSS/`
- `W4/` → `/W4/`
- `rbac-app/frontend/` → `/rbac/`

Nothing else is deployed (the backend is hosted separately; the frontend calls `https://180-93-1-121.sslip.io/api/v1`). To publish a new static folder, add a `cp` line in the "Assemble site" step.

## rbac-app/backend

A Node/Express 5 + Mongoose 9 REST API for role-based access control (coursework for HUST IT4409). Code comments and error messages are in **Vietnamese**; keep that convention. `rbac-app/frontend/` is empty for now.

### Commands

```bash
cd rbac-app/backend
npm install
cp .env.example .env   # then fill in MONGODB_URI and JWT_SECRET
node seed.js           # WIPES the Permission/Role/User collections, then reseeds them
node server.js         # starts on PORT (default 3001)
```

There are no npm scripts, tests or linter. `npm test` is the default placeholder and always fails.

Environment variables (`.env`, gitignored): `PORT`, `MONGODB_URI`, `JWT_SECRET`, `ACCESS_TOKEN_TTL` (seconds), and `CORS_ORIGINS` (comma-separated allow-list, default Live Server `:5500`).

### Architecture

- `server.js`: CORS allow-list, JSON body limit of 100kb, route mounting under `/api/v1`, a 404 fallback, and a central error handler. The error handler maps Mongoose `ValidationError` → 400 `VALIDATION_ERROR`, duplicate key `11000` → 409 `CONFLICT` with `<FIELD>_ALREADY_EXISTS` details, and JSON parse failure → 400 `MALFORMED_JSON`.
- `middleware/auth.js`:
  - `authenticate` verifies the Bearer JWT (`sub` = user id), loads the user with populated roles, and rejects any user whose status is not `active`. It sets `req.user` and `req.permissions`. `req.permissions` is a `Set` holding the **union of permissions across all of the user's roles**, recomputed on every request.
  - `requirePermission(...codes)` checks permission codes. Never check role names for authorization. Always gate on permission codes.
- `utils/http.js`: shared helpers that every route should use:
  - `fail(res, status, code, message, details?)` sends the uniform error envelope `{ error: { code, message, details?: [{ field, issue, message }] } }`.
  - `notAllowedFields(body, allowed)` provides the mass-assignment guard (`FIELD_NOT_ALLOWED`).
  - `parsePaging` (page ≥ 1, limit 1–100, default 10), `parseSort` (`-createdAt,fullName` syntax with a field allow-list), `escapeRegex` and `pageMeta` handle list endpoints.
  - `userView`, `roleView` and `roleSummary` build response shapes. Always serialize through these. Never return raw documents.
- `utils/rbac.js`: currently empty, but `routes/users.js` already imports `missingPermissions` and `isLastSuperAdmin` from it.
- Models:
  - `User`: email unique and lowercase; phone in E.164 format; `passwordHash` has `select: false`, so add `.select("+passwordHash")` when you need it; status is `active | locked | deleted`, where `deleted` is a soft delete that queries must exclude; `roles` holds ObjectId refs.
  - `Role`: `code` is immutable and matches `^[a-z][a-z0-9-]{2,49}$`; `isSystem` is immutable; `permissions` holds permission code strings.
  - `Permission`: `code` takes the form `resource:action`.

### Endpoints (under `/api/v1`)

- `POST /auth/tokens`: `{ grantType: "password", email, password }` → `{ tokenType, accessToken, expiresIn }`. Returns 401 `INVALID_CREDENTIALS`, or 403 `ACCOUNT_LOCKED`.
- `GET /me`: the current user plus their sorted effective `permissions`.
- `/users`: list, create, get, patch, delete, and role assignment via `PUT/DELETE /users/:userId/roles/:roleId`. The `loadUser` and `loadRole` param middlewares set `req.target` and return 404 `USER_NOT_FOUND` / `ROLE_NOT_FOUND`.
- `/roles` and `/permissions`: mounted in `server.js`, but nothing is implemented yet.

### Current state (work in progress)

The assignment is being implemented section by section. Placeholder comments such as `/* 2.3 */` or `TODO` mark the spec item each handler belongs to.
- In `routes/users.js`, only `GET /:userId` is implemented. The other handlers are empty stubs.
- `routes/roles.js`, `routes/permissions.js` and `utils/rbac.js` are **empty files**. `server.js` passes `require()` of the two route files to `app.use()`, and each returns `{}`. Express rejects a non-function there, so these files must export an `express.Router()` before the server will start.

### Seed data

`seed.js` creates 10 permissions and 5 roles. The roles are `super-admin` (all permissions), `user-manager`, `auditor`, `member` (no permissions) and `custom` (not a system role). It also creates one user per role. All seeded users have the password `Admin@2026`; the super-admin is `duy.bv251054m@sis.hust.edu.vn`, and the other users are `+1`…`+4` aliases of that address.
