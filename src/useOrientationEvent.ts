import { useEffect } from "react";

export function useOrientationEvent(event: string, handler: () => void, passive = false) {
    useEffect(() => {
      window.screen.orientation?.addEventListener(event, handler, passive);
  
      return function cleanup() {
        window.screen.orientation?.removeEventListener(event, handler);
      };
    });
  }