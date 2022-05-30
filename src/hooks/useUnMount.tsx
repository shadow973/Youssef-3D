import React from "react";

export const useComponentWillUnmount = (cleanupCallback: Function) => {
  const callbackRef = React.useRef(cleanupCallback);
  callbackRef.current = cleanupCallback; // always up to date
  React.useEffect(() => {
    return () => callbackRef.current();
  }, []);
};
