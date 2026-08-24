import { Link, useParams } from "react-router-dom";
import { useLang } from "@/context/LanguageContext";

const Legal = () => {
  const { kind } = useParams();
  const { t } = useLang();
  const isImp = kind === "impressum";
  return (
    <div className="container max-w-3xl py-14 prose prose-slate">
      <h1 className="font-display text-3xl font-extrabold">{isImp ? t("auth.misc.legalImpressum") : t("auth.misc.legalDatenschutz")}</h1>
      <p className="text-muted-foreground">
        {isImp ? t("auth.misc.legalImpressumText") : t("auth.misc.legalDatenschutzText")}
      </p>
      <p className="mt-4"><Link to="/" className="text-primary">{t("auth.misc.legalBackHome")}</Link></p>
    </div>
  );
};
export default Legal;
