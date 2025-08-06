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

  const navigateToProjects = useCallback(
    () => navigateTo("/projects"),
    [navigateTo]
  );
  return {
    navigateTo,
    navigateToProjects,
  };
};
