import { useNavigate } from "react-router-dom";
import { useCallback } from "react";

export const useNavigation = () => {
  const navigate = useNavigate();

  const navigateTo = useCallback(
    (path: string) => {
      navigate(path);
    },
    [navigate]
  );

  const openInNewTab = useCallback((url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
  }, []);

  const navigateToProjects = useCallback(
    () => navigateTo("/projects"),
    [navigateTo]
  );
  const navigateToContact = useCallback(
    () => navigateTo("/contact"),
    [navigateTo]
  );
  const openResume = useCallback(() => openInNewTab("/resume"), [openInNewTab]);

  return {
    navigateTo,
    navigateToProjects,
    navigateToContact,
    openResume,
  };
};
