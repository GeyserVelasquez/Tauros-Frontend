import { useState, useEffect } from "react";

/**
 * Hook para retrasar la actualización de un valor por un tiempo determinado (delay).
 * Útil para evitar llamadas excesivas a APIs durante la escritura en inputs.
 */
export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
