declare global {
	namespace App {
		interface Locals {
			user: import('$lib/global/types.global').User | null;
			session: import('$lib/global/types.global').Session | null;
		}
	}
}

export {};
