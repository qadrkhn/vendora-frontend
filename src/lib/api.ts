import axios from "axios";

import { useUserStore } from "@/stores/useUserStore";

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true,
});

API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error.response?.status;

    if (status === 401) {
      // Clear Zustand store first
      const { clearUser, setInitialized } = useUserStore.getState();
      clearUser();
      setInitialized(true);

      // Clear the cookie client-side because backend already cleared cookies

      // Redirect user
      if (typeof window !== "undefined") {
        window.location.href = "/sign-in";
      }
    }

    return Promise.reject(error);
  }
);

export default API;
