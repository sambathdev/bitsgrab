import { useEffect, useRef } from 'react';

// Generic hook for any component that needs shortcut access
export function useComponentShortcut<T extends Record<string, any>>(
  componentHook: () => T,
  globalKey: string
) {
  const componentState = componentHook();
  const stateRef = useRef(componentState);

  // Keep the ref updated with the latest state
  useEffect(() => {
    stateRef.current = componentState;
  }, [componentState]);

  // Set up a global function that can be called from anywhere
  useEffect(() => {
    window[globalKey] = stateRef.current;

    return () => {
      delete window[globalKey];
    };
  }, [globalKey]);
}
