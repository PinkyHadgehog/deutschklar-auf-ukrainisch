import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Volume2, VolumeX, Volume1, Loader2, Gauge } from "lucide-react";
import { useLang } from "@/context/LanguageContext";

const SPEEDS = [0.75, 1, 1.25] as const;
type Speed = (typeof SPEEDS)[number];

type Row = { letter: string; name: string; example: string; transcription: string; spell: string };

const ROWS: Row[] = [
  { letter: "A a", name: "а",         example: "Apfel",    transcription: "ап-фель",     spell: "ah" },
  { letter: "B b", name: "бе",        example: "Buch",     transcription: "бух",          spell: "beh" },
  { letter: "C c", name: "це",        example: "Computer", transcription: "комп'ю́тер",   spell: "tseh" },
  { letter: "D d", name: "де",        example: "Danke",    transcription: "да́н-ке",      spell: "deh" },
  { letter: "E e", name: "е",         example: "Elefant",  transcription: "еле-фа́нт",    spell: "eh" },
  { letter: "F f", name: "еф",        example: "Foto",     transcription: "фо́-то",       spell: "eff" },
  { letter: "G g", name: "ґе",        example: "gut",      transcription: "ґут",          spell: "geh" },
  { letter: "H h", name: "ха",        example: "Haus",     transcription: "хаус",         spell: "hah" },
  { letter: "I i", name: "і",         example: "Idee",     transcription: "і-де́",        spell: "ih" },
  { letter: "J j", name: "йот",       example: "ja",       transcription: "я",            spell: "jott" },
  { letter: "K k", name: "ка",        example: "Kaffee",   transcription: "ка-фе́",       spell: "kah" },
  { letter: "L l", name: "ель",       example: "Lampe",    transcription: "ла́м-пе",      spell: "ell" },
  { letter: "M m", name: "ем",        example: "Mutter",   transcription: "му́-тер",      spell: "emm" },
  { letter: "N n", name: "ен",        example: "Nacht",    transcription: "нахт",         spell: "enn" },
  { letter: "O o", name: "о",         example: "Obst",     transcription: "обст",         spell: "oh" },
  { letter: "P p", name: "пе",        example: "Park",     transcription: "парк",         spell: "peh" },
  { letter: "Q q", name: "ку",        example: "Quiz",     transcription: "квіц",         spell: "kuh" },
  { letter: "R r", name: "ер",        example: "Rose",     transcription: "ро́-зе",       spell: "err" },
  { letter: "S s", name: "ес",        example: "Sonne",    transcription: "зо́-не",       spell: "ess" },
  { letter: "T t", name: "те",        example: "Tee",      transcription: "те",           spell: "teh" },
  { letter: "U u", name: "у",         example: "Uhr",      transcription: "ур",           spell: "uh" },
  { letter: "V v", name: "фау",       example: "Vater",    transcription: "фа́-тер",      spell: "fau" },
  { letter: "W w", name: "ве",        example: "Wasser",   transcription: "ва́-сер",      spell: "weh" },
  { letter: "X x", name: "ікс",       example: "Taxi",     transcription: "та́-ксі",      spell: "iks" },
  { letter: "Y y", name: "іпсилон",   example: "Yoga",     transcription: "йо́-ґа",       spell: "üpsilon" },
  { letter: "Z z", name: "цет",       example: "Zeit",     transcription: "цайт",         spell: "tsett" },
  { letter: "Ä ä", name: "е-умлаут",  example: "Äpfel",    transcription: "е́п-фель",     spell: "äh" },
  { letter: "Ö ö", name: "о-умлаут",  example: "Öl",       transcription: "оьль",         spell: "öh" },
  { letter: "Ü ü", name: "у-умлаут",  example: "über",     transcription: "ю́-бер",       spell: "üh" },
  { letter: "ß",   name: "ес-цет",    example: "Straße",   transcription: "штра́-се",     spell: "eszett" },
];

function pickGermanVoice(): SpeechSynthesisVoice | null {
  const voices = window.speechSynthesis.getVoices();
  return (
    voices.find((v) => v.lang?.toLowerCase().startsWith("de")) ||
    voices.find((v) => /german|deutsch/i.test(v.name)) ||
    null
  );
}

const AlphabetAudio = () => {
  const { t } = useLang();
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [supported, setSupported] = useState(true);
  const [speed, setSpeed] = useState<Speed>(1);
  const [volume, setVolume] = useState<number>(1); // 0..1
  const speedRef = useRef(speed);
  const volumeRef = useRef(volume);

  useEffect(() => { speedRef.current = speed; }, [speed]);
  useEffect(() => { volumeRef.current = volume; }, [volume]);

  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      setSupported(false);
      return;
    }
    const load = () => window.speechSynthesis.getVoices();
    load();
    window.speechSynthesis.onvoiceschanged = load;
    return () => {
      window.speechSynthesis.onvoiceschanged = null;
      window.speechSynthesis.cancel();
    };
  }, []);

  const speak = (text: string, id: string, baseRate = 0.9) => {
    if (!supported) return;
    try {
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = "de-DE";
      // Clamp to Web Speech valid range (0.1..10 rate, 0..1 volume)
      utter.rate = Math.max(0.1, Math.min(10, baseRate * speedRef.current));
      utter.volume = Math.max(0, Math.min(1, volumeRef.current));
      utter.pitch = 1;
      const voice = pickGermanVoice();
      if (voice) utter.voice = voice;
      utter.onstart = () => setSpeakingId(id);
      utter.onend = () => setSpeakingId((cur) => (cur === id ? null : cur));
      utter.onerror = () => setSpeakingId((cur) => (cur === id ? null : cur));
      window.speechSynthesis.speak(utter);
    } catch {
      setSpeakingId(null);
    }
  };

  const playRow = (r: Row) => {
    speak(`${r.spell}. ${r.example}`, `row-${r.letter}`, 0.85);
  };

  const VolIcon = volume === 0 ? VolumeX : volume < 0.5 ? Volume1 : Volume2;

  return (
    <div className="mt-5">
      {!supported && (
        <div className="mb-3 text-xs text-muted-foreground">
          {t("lesson.audio.notSupported")}
        </div>
      )}
      <Card className="mb-3 p-3 rounded-xl border-0 shadow-soft flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-5">
        <div className="flex items-center gap-2">
          <Gauge className="h-4 w-4 text-muted-foreground" aria-hidden />
          <span className="text-xs font-medium text-muted-foreground">{t("lesson.audio.speed")}</span>
          <div className="inline-flex rounded-lg border border-border overflow-hidden">
            {SPEEDS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSpeed(s)}
                aria-pressed={speed === s}
                disabled={!supported}
                className={[
                  "px-2.5 py-1 text-xs font-medium transition-colors",
                  speed === s
                    ? "bg-primary text-primary-foreground"
                    : "bg-background hover:bg-secondary/50 text-foreground/80",
                ].join(" ")}
              >
                {s}x
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 flex-1 min-w-[180px]">
          <VolIcon className="h-4 w-4 text-muted-foreground" aria-hidden />
          <span className="text-xs font-medium text-muted-foreground">{t("lesson.audio.volume")}</span>
          <Slider
            value={[Math.round(volume * 100)]}
            onValueChange={(v) => setVolume((v[0] ?? 0) / 100)}
            max={100}
            step={5}
            disabled={!supported}
            aria-label={t("lesson.audio.volumeAria")}
            className="flex-1 max-w-[220px]"
          />
          <span className="text-xs tabular-nums w-9 text-right text-muted-foreground">
            {Math.round(volume * 100)}%
          </span>
        </div>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
        {ROWS.map((r) => {
          const rowId = `row-${r.letter}`;
          const letterId = `letter-${r.letter}`;
          const wordId = `word-${r.letter}`;
          const isRow = speakingId === rowId;
          const isLetter = speakingId === letterId;
          const isWord = speakingId === wordId;
          return (
            <Card
              key={r.letter}
              className="p-3 rounded-xl border-0 shadow-soft flex items-center gap-3 hover:bg-secondary/30 transition-colors"
            >
              <button
                type="button"
                aria-label={t("lesson.audio.playRowAria", { letter: r.letter, example: r.example })}
                onClick={() => playRow(r)}
                disabled={!supported}
                className="h-11 w-11 shrink-0 rounded-xl bg-primary text-primary-foreground grid place-items-center font-display font-bold text-lg hover:bg-primary/90 disabled:opacity-50"
              >
                {isRow ? <Loader2 className="h-5 w-5 animate-spin" /> : r.letter.split(" ")[0]}
              </button>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium truncate">{r.example}</span>
                  <span className="text-xs text-muted-foreground truncate">[{r.transcription}]</span>
                </div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  {t("lesson.audio.nameLabel")} <span className="font-medium text-foreground/80">{r.name}</span>
                </div>
              </div>
              <div className="flex flex-col gap-1 shrink-0">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className="h-7 px-2 text-xs"
                  onClick={() => speak(r.spell, letterId, 0.8)}
                  disabled={!supported}
                  aria-label={t("lesson.audio.playLetterAria", { spell: r.spell })}
                >
                  {isLetter ? <Loader2 className="h-3 w-3 animate-spin" /> : <Volume2 className="h-3 w-3" />}
                  <span className="ml-1">{t("lesson.audio.letterButton")}</span>
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className="h-7 px-2 text-xs"
                  onClick={() => speak(r.example, wordId, 0.9)}
                  disabled={!supported}
                  aria-label={t("lesson.audio.playWordAria", { example: r.example })}
                >
                  {isWord ? <Loader2 className="h-3 w-3 animate-spin" /> : <Volume2 className="h-3 w-3" />}
                  <span className="ml-1">{t("lesson.audio.wordButton")}</span>
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
      <p className="mt-3 text-xs text-muted-foreground">
        {t("lesson.audio.footerTip")}
      </p>
    </div>
  );
};

export default AlphabetAudio;
