import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Volume2, VolumeX, Volume1, Loader2, Gauge } from "lucide-react";

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
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [supported, setSupported] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      setSupported(false);
      return;
    }
    // Trigger voice list load (some browsers populate async)
    const load = () => window.speechSynthesis.getVoices();
    load();
    window.speechSynthesis.onvoiceschanged = load;
    return () => {
      window.speechSynthesis.onvoiceschanged = null;
      window.speechSynthesis.cancel();
    };
  }, []);

  const speak = (text: string, id: string, rate = 0.9) => {
    if (!supported) return;
    try {
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = "de-DE";
      utter.rate = rate;
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
    // Letter name + example word, with a tiny pause via comma
    speak(`${r.spell}. ${r.example}`, `row-${r.letter}`, 0.85);
  };

  return (
    <div className="mt-5">
      {!supported && (
        <div className="mb-3 text-xs text-muted-foreground">
          Твій браузер не підтримує озвучення (Web Speech API). Спробуй Chrome або Edge.
        </div>
      )}
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
                aria-label={`Програти літеру ${r.letter} і приклад ${r.example}`}
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
                  Назва: <span className="font-medium text-foreground/80">{r.name}</span>
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
                  aria-label={`Програти назву літери ${r.spell}`}
                >
                  {isLetter ? <Loader2 className="h-3 w-3 animate-spin" /> : <Volume2 className="h-3 w-3" />}
                  <span className="ml-1">Літера</span>
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className="h-7 px-2 text-xs"
                  onClick={() => speak(r.example, wordId, 0.9)}
                  disabled={!supported}
                  aria-label={`Програти слово ${r.example}`}
                >
                  {isWord ? <Loader2 className="h-3 w-3 animate-spin" /> : <Volume2 className="h-3 w-3" />}
                  <span className="ml-1">Слово</span>
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
      <p className="mt-3 text-xs text-muted-foreground">
        💡 Натисни велику плитку зліва, щоб почути назву літери та приклад поспіль. Озвучення працює через системний голос німецькою (de-DE).
      </p>
    </div>
  );
};

export default AlphabetAudio;
