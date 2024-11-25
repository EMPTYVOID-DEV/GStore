# GStore DB

A shared database package utilized across GStore applications.

## Technology Stack

1. **Drizzle ORM**: SQL toolkit and query builder
2. **pg**: PostgreSQL client for JavaScript
3. **Zod**: TypeScript-first schema validation

## Operation

The package build produces two main files:

- **migrator.js**: Handles database migrations and admin user creation
- **index.js**: Exports essential database utilities:
  - Database initialization
  - Type definitions
  - Zod schemas
  - Drizzle schema
  - Drizzle orm utilities

The package uses tsup for bundling, with database migrations stored in the drizzle directory.
