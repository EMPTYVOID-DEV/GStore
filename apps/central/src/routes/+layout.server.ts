import type { ServerLoad } from '@sveltejs/kit';

export const load: ServerLoad = async ({ locals, url }) => {
	const username = locals.user?.username;
	const isAdmin = locals.user?.admin;
	if (url.pathname) return { username, isAdmin };
};
