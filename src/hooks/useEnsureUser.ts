import { useEffect, useState } from "react";

import { useUserStore } from "@/stores/useUserStore";
import API from "@/lib/api";
import apiRoutes from "@/constants/apiRoutes";

const hasToken = (): boolean => {
  if (typeof document === "undefined") return false;
  return document.cookie
    .split(";")
    .some((c) => c.trim().startsWith("has_token="));
};

const useEnsureUser = () => {
  const [loading, setLoading] = useState(true);
  const { user, setUser, clearUser, initialized, setInitialized } =
    useUserStore();

  useEffect(() => {
    if (initialized || user) {
      setLoading(false);
      return;
    }

    if (!hasToken()) {
      setInitialized(true);
      setLoading(false);
      return;
    }

    const fetchUserData = async () => {
      setLoading(true);
      try {
        const { data } = await API.get(apiRoutes.user.me);
        setUser(data);
      } catch (err) {
        console.error("Failed to fetch user info", err);
        clearUser();
      } finally {
        setInitialized(true);
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user, initialized, setUser, clearUser, setInitialized]);

  return { user, loading };
};

export default useEnsureUser;
