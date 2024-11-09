import { toast } from 'svelte-sonner';
import SyncToast from '$client/components/toast/syncToast.svelte';

export function showToast(
	header: string,
	description: string,
	type: 'primary' | 'success' | 'danger'
) {
	if (description)
		toast.custom(SyncToast, {
			componentProps: {
				header: header,
				description,
				type
			}
		});
}
