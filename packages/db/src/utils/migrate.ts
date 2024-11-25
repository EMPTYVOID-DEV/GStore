import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { db } from './db.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { z } from 'zod';
import { hash } from '@node-rs/argon2';
import { userTable } from './schema.js';
import { eq } from 'drizzle-orm';

const passwordSchema = z
  .string()
  .min(8, { message: 'Password must be at least 8 characters long' })
  .regex(/[a-z]/, { message: 'Password must contain at least one lowercase letter' })
  .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
  .regex(/\d/, { message: 'Password must contain at least one number' })
  .regex(/[!@#$%^&*(),.?"':{}|<>]/, {
    message: 'Password must contain at least one special character',
  });

const usernameSchema = z
  .string()
  .min(4, { message: 'Username must be at least 4 characters long' })
  .max(28, { message: 'Username must be no longer than 28 characters' });

async function runMigration() {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  const migrationsFolder = join(__dirname, '../../drizzle');
  console.log('Starting migration process ⌛');

  // Run database migrations
  try {
    await migrate(db, { migrationsFolder });
    console.log('Migrations applied successfully ✅');
  } catch (error) {
    console.error('Migration failed 🚨:', error);
    return;
  }

  // Create admin user
  console.log('Creating admin user...');
  const adminUsername = process.env['ADMIN_USERNAME'];
  const adminPassword = process.env['ADMIN_PASSWORD'];

  if (!adminUsername || !adminPassword) {
    console.error('Admin username and password must be provided. Action aborted.');
    return;
  }

  console.log('Validating admin credentials...');
  const usernameValidation = usernameSchema.safeParse(adminUsername);
  const passwordValidation = passwordSchema.safeParse(adminPassword);

  if (!usernameValidation.success) {
    console.error('Invalid username:', usernameValidation.error.errors.map((e) => e.message).join(', '));
    return;
  }

  if (!passwordValidation.success) {
    console.error('Invalid password:', passwordValidation.error.errors.map((e) => e.message).join(', '));
    return;
  }

  try {
    const hashedPassword = await hash(adminPassword);
    const isExist = await db.query.userTable.findFirst({ where: eq(userTable.username, adminUsername) });

    if (isExist) {
      console.error('Admin Username already exists.');
      return;
    }

    await db.insert(userTable).values({
      admin: true,
      username: adminUsername,
      password: hashedPassword,
    });
    console.log('Admin user created successfully ✅');
  } catch (error) {
    console.error('Failed to add the admin user 🚨:', error);
  }
}

// Run the migration and handle errors
runMigration()
  .catch((error) => console.error('Unexpected error in migration process 🚨:', error))
  .then(() => process.exit(0));
