import { useCallback } from "react";

interface NavigationOptions {
  loadingText?: string;
  delay?: number;
  onStart?: () => void;
  onComplete?: () => void;
  onError?: (error: Error) => void;
}

export const useNavigation = () => {
  const navigateTo = useCallback(
    (url: string, options: NavigationOptions = {}) => {
      const {
        loadingText = "Loading...",
        delay = 300,
        onStart,
        onComplete,
        onError,
      } = options;

      try {
        onStart?.();

        // Find the button that triggered this navigation
        const activeElement = document.activeElement as HTMLButtonElement;
        if (activeElement && activeElement.classList.contains("btn")) {
          const originalText = activeElement.textContent;
          activeElement.textContent = loadingText;
          activeElement.disabled = true;

          setTimeout(() => {
            try {
              if (url.startsWith("http")) {
                window.open(url, "_blank");
              } else {
                window.location.href = url;
              }
              onComplete?.();
            } catch (error) {
              // Restore button state on error
              activeElement.textContent = originalText;
              activeElement.disabled = false;
              onError?.(error as Error);
            }
          }, delay);
        } else {
          // Fallback if no button found
          setTimeout(() => {
            try {
              if (url.startsWith("http")) {
                window.open(url, "_blank");
              } else {
                window.location.href = url;
              }
              onComplete?.();
            } catch (error) {
              onError?.(error as Error);
            }
          }, delay);
        }
      } catch (error) {
        onError?.(error as Error);
      }
    },
    []
  );

  const navigateToProjects = useCallback(() => {
    navigateTo("/projects", {
      loadingText: "Loading Projects...",
      onStart: () => console.log("Navigating to projects..."),
      onComplete: () => console.log("Navigation to projects completed"),
      onError: (error) => console.error("Navigation error:", error),
    });
  }, [navigateTo]);

  const navigateToContact = useCallback(() => {
    navigateTo("/contact", {
      loadingText: "Redirecting...",
      onStart: () => console.log("Navigating to contact..."),
      onComplete: () => console.log("Navigation to contact completed"),
      onError: (error) => console.error("Navigation error:", error),
    });
  }, [navigateTo]);

  const openResume = useCallback(() => {
    navigateTo("/resume", {
      loadingText: "Opening...",
      onStart: () => console.log("Opening resume..."),
      onComplete: () => console.log("Resume opened successfully"),
      onError: (error) => console.error("Error opening resume:", error),
    });
  }, [navigateTo]);

  return {
    navigateTo,
    navigateToProjects,
    navigateToContact,
    openResume,
  };
};
