import { Button } from "@/components/ui/button";
import { vocabThemes } from "@/data/mock";
import { useLang } from "@/context/LanguageContext";

interface QuizTopicSelectProps {
  selected: string | null;
  onSelect: (id: string) => void;
  onStart: () => void;
}

const QuizTopicSelect = ({ selected, onSelect, onStart }: QuizTopicSelectProps) => {
  const { t } = useLang();
  return (
  <div>
    <div className="text-center">
      <h2 className="font-display text-2xl md:text-3xl font-extrabold">{t("vocab.quiz.select.heading")}</h2>
      <p className="text-muted-foreground mt-2">{t("vocab.quiz.select.subtitle")}</p>
    </div>

    <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
      {vocabThemes.map((th) => {
        const active = selected === th.id;
        return (
          <button
            key={th.id}
            type="button"
            aria-pressed={active}
            onClick={() => onSelect(th.id)}
            className={`p-4 rounded-2xl border text-left transition ${
              active
                ? "bg-gradient-primary text-primary-foreground border-transparent shadow-soft"
                : "bg-card hover:border-primary/40"
            }`}
          >
            <div className="text-2xl">{th.emoji}</div>
            <div className="font-display font-bold mt-2 text-sm">{th.title}</div>
            <div className={`text-xs mt-0.5 ${active ? "opacity-80" : "text-muted-foreground"}`}>
              {th.titleDe} · {t("vocab.quiz.select.wordsCount", { count: th.count })}
            </div>
          </button>
        );
      })}
    </div>

    <div className="mt-6 flex justify-center">
      <Button className="bg-gradient-primary" size="lg" disabled={!selected} onClick={onStart}>
        {t("vocab.quiz.select.start")}
      </Button>
    </div>
  </div>
  );
};

export default QuizTopicSelect;
