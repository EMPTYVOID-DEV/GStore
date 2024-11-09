import { db } from '$server/database/db';
import { userTable, keyTable } from '$server/database/schema';
import type { User, Key } from '$server/types.server';

export async function insertUser(newUser: User, key: Key) {
	return db.transaction(async (tx) => {
		await tx.insert(userTable).values(newUser);
		await tx.insert(keyTable).values(key);
	});
}
