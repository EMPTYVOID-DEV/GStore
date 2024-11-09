import type { Key, User } from '$global/types.global';
import { db } from '$server/database/db';
import { userTable, keyTable } from '$server/database/schema';

export async function insertUser(newUser: User, key: Key) {
	return db.transaction(async (tx) => {
		await tx.insert(userTable).values(newUser);
		await tx.insert(keyTable).values(key);
	});
}
