/**
 * Server-side API wrapper for making authenticated HTTP requests using fetch in a Next.js app.
 *
 * This utility is designed to:
 * - Automatically attach the `access_token` from HttpOnly cookies (set by Laravel Passport or any backend auth system).
 * - Handle `401 Unauthorized` responses by redirecting to the sign-in page.
 *
 * @template T - The expected return type of the parsed JSON response.
 * @param {string} path - API endpoint path relative to the base URL.
 *   Example: `/v1/me` or `/v1/categories`.
 * @param {RequestInit} [options={}] - Additional fetch options such as method, body, headers, etc.
 *
 * @returns {Promise<T | null>} - Returns the parsed JSON response as type `T`, or `null` if the request fails.
 *
 * @example
 * ```ts
 * const user = await apiServer<User>('/v1/me');
 * if (user) {
 *   // user.id, user.name etc.
 * }
 * ```
 *
 * @example
 * ```ts
 * const categories = await apiServer<Category[]>('/v1/categories', {
 *   method: 'GET'
 * });
 * ```
 *
 * @note
 * - This function is meant to be used in **server-side contexts only** (e.g., inside `getServerSideProps`, Server Components, or custom SSR utilities).
 * - It will redirect the user to `/sign-in` if the backend returns a 401 (unauthenticated).
 * - For client-side API requests, use your Axios-based `API` instance.
 */

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

interface ApiServerOptions extends RequestInit {
  query?: Record<string, string | number | boolean>;
}

export async function apiServer<T>(
  path: string,
  options: ApiServerOptions = {}
): Promise<T | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  // Build query string if query params exist
  let url = `${API_BASE}${path}`;
  if (options.query) {
    const queryString = new URLSearchParams(
      Object.entries(options.query).reduce((acc, [key, value]) => {
        acc[key] = String(value);
        return acc;
      }, {} as Record<string, string>)
    ).toString();
    url += `?${queryString}`;
  }

  const res = await fetch(url, {
    method: options.method || "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
    credentials: "include",
    cache: "no-store",
    ...options,
  });

  if (res.status === 401) {
    redirect("/sign-in");
  }

  if (!res.ok) {
    console.error(`[apiServer] ${res.status}: ${res.statusText}`);
    return null;
  }

  return res.json();
}
