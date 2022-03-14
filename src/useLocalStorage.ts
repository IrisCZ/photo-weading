import { useState } from "react";

export function useLocalStorage(
    key: string,
    initialValue: string
  ): [string, (value: string | ((value: string) => string)) => void] {
    const [storedValue, setStoredValue] = useState(() => {
      if (typeof window === "undefined") {
        return initialValue;
      }
      try {
        const item = window.localStorage.getItem(key);
        return item ? item : initialValue;
      } catch (error) {
        console.log(error);
        return initialValue;
      }
    });
    const setValue = (value: string | ((value: string) => string)) => {
      try {
        const valueToStore =
          value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        if (typeof window !== "undefined") {
          window.localStorage.setItem(key, valueToStore);
        }
      } catch (error) {
        console.log(error);
      }
    };
    return [storedValue, setValue];
}