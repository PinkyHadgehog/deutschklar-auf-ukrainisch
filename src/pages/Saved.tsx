import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useLang } from "@/context/LanguageContext";
import SavedLibrary from "@/components/profile/SavedLibrary";

const Saved = () => {
  const { user } = useAuth();
  const { t } = useLang();
  if (!user) return <Navigate to="/login" replace />;

  return (
    <div className="container max-w-4xl py-10">
      <h1 className="font-display text-3xl md:text-4xl font-extrabold">{t("savedPage.title")}</h1>
      <p className="text-muted-foreground mt-1">{t("savedPage.subtitle")}</p>

      <div className="mt-8">
        <SavedLibrary variant="page" />
      </div>
    </div>
  );
};

export default Saved;
