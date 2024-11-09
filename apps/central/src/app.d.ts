declare global {
	namespace App {
		interface Locals {
			user: import('$lib/server/types.server').User | null;
			session: import('$lib/server/types.server').Session | null;
		}
	}
}

export {};
