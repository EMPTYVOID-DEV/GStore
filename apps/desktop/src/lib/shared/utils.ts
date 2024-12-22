import { toast } from "svelte-sonner";
import SyncToast from "$components/toast/syncToast.svelte";
import type { ComponentType } from "svelte";
import { right, left } from "fp-ts/lib/Either";

export function showToast(
  header: string,
  description: string,
  type: "primary" | "success" | "danger"
) {
  if (description)
    toast.custom(SyncToast as unknown as ComponentType, {
      componentProps: {
        header: header,
        description,
        type,
      },
    });
}

export async function tauriFetch(fetch: Promise<Response>, action: string) {
  try {
    const res = await fetch;
    if (!res.ok) {
      throw new Error("Something went wrong", {
        cause: { status: res.status },
      });
    }
    return right(res);
  } catch (error) {
    if (error instanceof Error && error.cause) {
      const cause = error.cause as { status: number };
      const errorMap: Record<number, string> = {
        500: "Service unavailable",
        403: `Insufficient permissions for ${action}`,
        404: `Resource not found for ${action}`,
        429: `Rate limits reached during ${action}`,
        400: `API validation error during ${action}`,
      };
      const message =
        errorMap[cause.status] || `HTTP error ${cause.status} during ${action}`;
      return left(message);
    } else return left("Something went wrong");
  }
}
