// app/lib/auth/getServerUser.ts

import apiRoutes from "@/constants/apiRoutes";
import { apiServer } from "@/lib/apiServer";

export type ServerUser = {
  id: number;
  name: string;
  email: string;
  role: string;
  email_verified: boolean;
  email_verified_at: string | null;
  picture?: string;
};

/**
 * Fetches the currently authenticated user on the server-side.
 *
 * @returns {Promise<ServerUser | null>} - The authenticated user data or `null` if not authenticated.
 *
 * @example
 * ```ts
 * const user = await getServerUser();
 * if (user) {
 *   console.log(user.name);
 * }
 * ```
 */
export async function getServerUser(): Promise<ServerUser | null> {
  return await apiServer<ServerUser>(apiRoutes.user.me);
}
