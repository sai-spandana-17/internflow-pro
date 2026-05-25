import { useEffect } from "react";

export function useDocTitle(title: string) {
  useEffect(() => {
    if (typeof document !== "undefined") document.title = title;
  }, [title]);
}

export const APP_VERSION = "1.0.0";
