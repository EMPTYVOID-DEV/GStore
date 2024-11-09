import type { ServerLoad } from '@sveltejs/kit';

export const load: ServerLoad = async ({ locals, url }) => {
	const username = locals.user?.username;
	if (url.pathname) return { username };
};
