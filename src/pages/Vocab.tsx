import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { vocabThemes, vocabWords } from "@/data/mock";
import QuizMode from "@/components/vocab/QuizMode";
import QuizTopicSelect from "@/components/vocab/QuizTopicSelect";
import { shuffle, DEFAULT_SESSION_SIZE } from "@/lib/quiz";
import { Heart, RotateCw, ChevronLeft, ChevronRight, Volume2, Search, X } from "lucide-react";

const speakDe = (text: string, rate = 0.75) => {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "de-DE";
  u.rate = rate;
  const voices = window.speechSynthesis.getVoices();
  const de = voices.find((v) => v.lang?.toLowerCase().startsWith("de"));
  if (de) u.voice = de;
  window.speechSynthesis.speak(u);
};

const stripArtikel = (de: string, artikel?: string) => {
  if (!artikel) return de;
  const re = new RegExp(`^\\s*(der|die|das)\\s+`, "i");
  return de.replace(re, "");
};

const Vocab = () => {
  const [theme, setTheme] = useState<string>(vocabThemes[0].id);
  const [favs, setFavs] = useState<Set<string>>(new Set());
  const [flipIdx, setFlipIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState("browse");
  const [sessionSeed, setSessionSeed] = useState(0);
  const [seen, setSeen] = useState(1);
  const [sessionDone, setSessionDone] = useState(false);
  const [selectedQuizTopic, setSelectedQuizTopic] = useState<string | null>(null);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizRun, setQuizRun] = useState(0);

  const quizWords = useMemo(
    () => (selectedQuizTopic ? vocabWords.filter((w) => w.theme === selectedQuizTopic) : []),
    [selectedQuizTopic]
  );

  const openQuizTab = () => {
    if (!quizStarted) setSelectedQuizTopic((cur) => cur ?? theme);
  };

  const words = useMemo(() => {
    const base = vocabWords.filter((w) => w.theme === theme).length
      ? vocabWords.filter((w) => w.theme === theme)
      : vocabWords;
    const q = query.trim().toLowerCase();
    if (!q) return base;
    return base.filter(
      (w) =>
        w.de.toLowerCase().includes(q) ||
        w.uk.toLowerCase().includes(q) ||
        (w.artikel?.toLowerCase().includes(q) ?? false) ||
        (w.plural?.toLowerCase().includes(q) ?? false)
    );
  }, [theme, query]);
  const sessionWords = useMemo(
    () => shuffle(words).slice(0, DEFAULT_SESSION_SIZE),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [words, sessionSeed]
  );
  const current = sessionWords.length ? sessionWords[flipIdx % sessionWords.length] : null;

  const resetSession = () => {
    setSessionSeed((s) => s + 1);
    setFlipIdx(0);
    setFlipped(false);
    setSeen(1);
    setSessionDone(false);
  };

  const toggleFav = (de: string) => {
    const n = new Set(favs);
    n.has(de) ? n.delete(de) : n.add(de);
    setFavs(n);
  };

  const artikelColor = (a?: string) => a === "der" ? "text-info" : a === "die" ? "text-destructive" : "text-success";

  return (
    <div className="container py-10 md:py-14">
      <div className="max-w-3xl">
        <h1 className="font-display text-3xl md:text-4xl font-extrabold">Словник за темами</h1>
        <p className="text-muted-foreground mt-2">Вивчай слова в контексті — з артиклями, множиною та прикладами.</p>
      </div>

      <Tabs value={tab} onValueChange={(v) => { setTab(v); if (v === "quiz") openQuizTab(); }} className="mt-8">
        <TabsList>
          <TabsTrigger value="browse">Перегляд</TabsTrigger>
          <TabsTrigger value="flash">Flashcards</TabsTrigger>
          <TabsTrigger value="quiz">Quiz</TabsTrigger>
        </TabsList>

        <TabsContent value="browse" className="mt-6">
          <div className="mb-6 relative max-w-xl">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => { setQuery(e.target.value); setFlipIdx(0); }}
              placeholder="Пошук слова німецькою або українською…"
              className="pl-9 pr-9 rounded-2xl"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                aria-label="Очистити пошук"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mb-8">
            {vocabThemes.map((th) => (
              <button key={th.id} onClick={() => { setTheme(th.id); setFlipIdx(0); setFlipped(false); setSeen(1); setSessionDone(false); }}
                className={`p-4 rounded-2xl border text-left transition ${
                  theme === th.id ? "bg-gradient-primary text-primary-foreground border-transparent shadow-soft" : "bg-card hover:border-primary/40"
                }`}>
                <div className="text-2xl">{th.emoji}</div>
                <div className="font-display font-bold mt-2 text-sm">{th.title}</div>
                <div className={`text-xs mt-0.5 ${theme === th.id ? "opacity-80" : "text-muted-foreground"}`}>{th.titleDe} · {th.count}</div>
              </button>
            ))}
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {words.length === 0 && (
              <div className="col-span-full text-muted-foreground text-sm">
                Нічого не знайдено за запитом «{query}».
              </div>
            )}
            {words.map((w) => (
              <Card key={w.de} className="p-5 rounded-2xl border-0 shadow-soft">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-display text-xl font-extrabold">
                      <span className={`mr-1.5 ${artikelColor(w.artikel)}`}>{w.artikel}</span>{stripArtikel(w.de, w.artikel)}
                    </div>
                    <div className="text-sm text-muted-foreground">Pl.: {w.plural}</div>
                  </div>
                  <button onClick={() => toggleFav(w.de)}>
                    <Heart className={`h-5 w-5 ${favs.has(w.de) ? "fill-destructive text-destructive" : "text-muted-foreground"}`} />
                  </button>
                </div>
                <div className="mt-2 text-primary font-medium">{w.uk}</div>
                <div className="mt-3 p-3 rounded-xl bg-secondary/60 text-sm">
                  <div>{w.sample}</div>
                  <div className="text-muted-foreground mt-0.5">{w.sampleUk}</div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="flash" className="mt-6">
          <div className="max-w-xl mx-auto">
            <Badge className="mb-3">{vocabThemes.find((t) => t.id === theme)?.title}</Badge>

            {sessionDone ? (
              <Card className="p-10 rounded-3xl border-0 shadow-elevated text-center">
                <div className="font-display text-3xl font-extrabold">🎉 Lernrunde abgeschlossen</div>
                <div className="mt-3 text-muted-foreground">
                  Ти пройшла {sessionWords.length} слів. Готова перевірити себе?
                </div>
                <div className="mt-6 flex flex-wrap gap-2 justify-center">
                  <Button className="bg-gradient-primary" onClick={() => { setSessionDone(false); setTab("quiz"); openQuizTab(); }}>
                    Почати Quiz
                  </Button>
                  <Button variant="outline" onClick={resetSession}>
                    <RotateCw className="h-4 w-4 mr-1" /> Ще раз повторити
                  </Button>
                </div>
              </Card>
            ) : (
              <>
                <div className="mb-3">
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
                    <span>{Math.min(seen, sessionWords.length)} / {sessionWords.length} Wörter</span>
                  </div>
                  <Progress value={sessionWords.length ? (Math.min(seen, sessionWords.length) / sessionWords.length) * 100 : 0} className="h-2" />
                </div>
                <Card onClick={() => current && setFlipped(!flipped)}
                  className="p-10 rounded-3xl border-0 shadow-elevated cursor-pointer min-h-[260px] flex flex-col items-center justify-center text-center bg-gradient-primary text-primary-foreground">
                  {!current ? (
                    <div className="opacity-90">Немає слів за цим запитом.</div>
                  ) : !flipped ? (
                    <>
                      <div className="text-xs uppercase tracking-wider opacity-80">Deutsch</div>
                      <div className="font-display text-4xl font-extrabold mt-2">{current.artikel} {stripArtikel(current.de, current.artikel)}</div>
                      <div className="opacity-80 mt-2">Pl.: {current.plural}</div>
                      <div className="mt-5" onClick={(e) => e.stopPropagation()}>
                        <Button
                          size="sm"
                          className="bg-yellow-400 text-black border-yellow-400 hover:bg-yellow-500 hover:border-yellow-500 active:bg-yellow-600 active:border-yellow-600"
                          onClick={(e) => { e.stopPropagation(); speakDe(`${current.artikel ?? ""} ${current.de}`.trim(), 0.55); }}
                        >
                          <Volume2 className="h-4 w-4 mr-1" /> Прослухати
                        </Button>
                      </div>
                      <div className="text-xs opacity-70 mt-4">Натисни картку, щоб перевернути</div>
                    </>
                  ) : (
                    <>
                      <div className="text-xs uppercase tracking-wider opacity-80">Українською</div>
                      <div className="font-display text-3xl font-extrabold mt-2">{current.uk}</div>
                      <div className="mt-4 opacity-90 italic">«{current.sample}»</div>
                    </>
                  )}
                </Card>
                <div className="mt-5 flex items-center justify-between">
                  <Button variant="outline" disabled={flipIdx === 0} onClick={() => { setFlipIdx(Math.max(0, flipIdx - 1)); setFlipped(false); }}>
                    <ChevronLeft className="h-4 w-4 mr-1"/> Назад
                  </Button>
                  <Button variant="ghost" onClick={() => setFlipped(!flipped)}><RotateCw className="h-4 w-4 mr-1"/> Перевернути</Button>
                  <Button className="bg-gradient-primary" onClick={() => {
                    if (flipIdx + 1 >= sessionWords.length) { setSessionDone(true); return; }
                    setFlipIdx(flipIdx + 1);
                    setSeen((s) => Math.max(s, flipIdx + 2));
                    setFlipped(false);
                  }}>
                    Далі <ChevronRight className="h-4 w-4 ml-1"/>
                  </Button>
                </div>
              </>
            )}
          </div>
        </TabsContent>

        <TabsContent value="quiz" className="mt-6">
          <div className="max-w-2xl mx-auto">
            {!quizStarted || !selectedQuizTopic ? (
              <QuizTopicSelect
                selected={selectedQuizTopic}
                onSelect={setSelectedQuizTopic}
                onStart={() => { setQuizRun((r) => r + 1); setQuizStarted(true); }}
              />
            ) : (
              <QuizMode
                key={`${selectedQuizTopic}-${quizRun}`}
                words={quizWords}
                themeId={selectedQuizTopic}
                themeTitle={vocabThemes.find((t) => t.id === selectedQuizTopic)?.title ?? ""}
                onBackToVocab={() => { setQuizStarted(false); setTab("browse"); }}
                onChangeTopic={() => setQuizStarted(false)}
              />
            )}
          </div>
        </TabsContent>

      </Tabs>
    </div>
  );
};

export default Vocab;
