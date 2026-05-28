import { useCallback, useMemo, useState } from "react";
import type { ToastData } from "../components/common/Toast";

export function useToasts() {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const remove = useCallback((id: string) => {
    setToasts((t) => t.filter((x) => x.id !== id));
  }, []);

  const push = useCallback((type: ToastData["type"], message: string) => {
    const id = crypto.randomUUID();
    setToasts((t) => [{ id, type, message }, ...t].slice(0, 4));
    return id;
  }, []);

  return useMemo(() => ({ toasts, push, remove }), [toasts, push, remove]);
}

