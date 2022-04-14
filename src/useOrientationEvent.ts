import { useEffect } from "react";

export function useOrientationEvent(event: string, handler: (orientation: OrientationType) => void, passive = false) {
    const handleChange = () => handler(window.screen.orientation.type)
    useEffect(() => {
      window.screen.orientation?.addEventListener(event, handleChange, passive);
      
      return function cleanup() {
        window.screen.orientation?.removeEventListener(event, handleChange);
      };
    });
    return window.screen.orientation.type
  }