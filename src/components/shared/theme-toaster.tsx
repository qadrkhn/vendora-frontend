"use client";

import { useTheme } from "next-themes";
import { Toaster } from "sonner";

const ThemeToaster = () => {
  const { resolvedTheme } = useTheme();

  return (
    <Toaster
      theme={resolvedTheme === "dark" ? "dark" : "light"}
      position="bottom-right"
      toastOptions={{ closeButton: true }}
    />
  );
};

export default ThemeToaster;
