import { db, fileTable, and, eq, SQL } from 'db';
import { none, some } from 'fp-ts/Option';
import type { Option } from 'fp-ts/Option';

export async function getFileEntry(storeId: string, id: string, additionalQuerying?: SQL): Promise<Option<typeof fileTable.$inferSelect>> {
  const entry = await db.query.fileTable.findFirst({
    where: and(eq(fileTable.storeId, storeId), eq(fileTable.id, id), additionalQuerying),
  });
  return entry ? some(entry) : none;
}
