import { useQuery } from "@tanstack/react-query";

import { useAuth } from "@/context/AuthContext";
import { getAllLessonProgressFromApi } from "@/lib/lessonProgressApi";

/**
 * Lädt alle Lektionsfortschritte des angemeldeten Nutzers.
 * PostgreSQL bleibt die maßgebliche Datenquelle.
 */
export const useLessonProgressQuery = () => {
  const { user, accessToken } = useAuth();

  return useQuery({
    queryKey: ["lesson-progress", user?.id],

    queryFn: () => {
      if (!accessToken) {
        throw new Error("User is not authenticated");
      }

      return getAllLessonProgressFromApi(accessToken);
    },

    enabled: Boolean(user && accessToken),

    staleTime: 30_000,
  });
};


