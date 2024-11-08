import { db } from '@database/db';
import { fileTable } from '@database/schema';
import { and, eq, SQL } from 'drizzle-orm';
import { none, some } from 'fp-ts/Option';
import type { Option } from 'fp-ts/Option';

export async function getFileEntry(storeId: string, id: string, additionalQuerying?: SQL): Promise<Option<typeof fileTable.$inferSelect>> {
  const entry = await db.query.fileTable.findFirst({
    where: and(eq(fileTable.storeId, storeId), eq(fileTable.id, id), additionalQuerying),
  });
  return entry ? some(entry) : none;
}
