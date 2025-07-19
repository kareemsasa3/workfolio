import { useEffect } from "react";

export const useLockBodyScroll = (isLocked: boolean) => {
  useEffect(() => {
    if (!isLocked) return;

    // Store original overflow values
    const originalOverflowY = document.body.style.overflowY;
    const originalOverflowX = document.body.style.overflowX;

    // Force scrollbar to be visible to prevent viewport width changes
    document.body.style.overflowY = "scroll";
    document.body.style.overflowX = "hidden";

    // Cleanup function: Restore original styles
    return () => {
      if (originalOverflowY) {
        document.body.style.overflowY = originalOverflowY;
      } else {
        document.body.style.overflowY = ""; // Reset to default
      }
      if (originalOverflowX) {
        document.body.style.overflowX = originalOverflowX;
      } else {
        document.body.style.overflowX = ""; // Reset to default
      }
    };
  }, [isLocked]);

  // Ensure cleanup on unmount
  useEffect(() => {
    return () => {
      // Always ensure we clean up any overflow modifications when component unmounts
      document.body.style.overflowY = "";
      document.body.style.overflowX = "";
    };
  }, []);
};
