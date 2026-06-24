import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { vocabThemes, vocabWords } from "@/data/mock";
import { Heart, RotateCw, ChevronLeft, ChevronRight } from "lucide-react";

const Vocab = () => {
  const [theme, setTheme] = useState<string>(vocabThemes[0].id);
  const [favs, setFavs] = useState<Set<string>>(new Set());
  const [flipIdx, setFlipIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const words = useMemo(() => vocabWords.filter((w) => w.theme === theme).length ? vocabWords.filter((w) => w.theme === theme) : vocabWords, [theme]);
  const current = words[flipIdx % words.length];

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

      <Tabs defaultValue="browse" className="mt-8">
        <TabsList>
          <TabsTrigger value="browse">Перегляд</TabsTrigger>
          <TabsTrigger value="flash">Flashcards</TabsTrigger>
        </TabsList>

        <TabsContent value="browse" className="mt-6">
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mb-8">
            {vocabThemes.map((th) => (
              <button key={th.id} onClick={() => { setTheme(th.id); setFlipIdx(0); setFlipped(false); }}
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
            {words.map((w) => (
              <Card key={w.de} className="p-5 rounded-2xl border-0 shadow-soft">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-display text-xl font-extrabold">
                      <span className={`mr-1.5 ${artikelColor(w.artikel)}`}>{w.artikel}</span>{w.de}
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
            <Card onClick={() => setFlipped(!flipped)}
              className="p-10 rounded-3xl border-0 shadow-elevated cursor-pointer min-h-[260px] flex flex-col items-center justify-center text-center bg-gradient-primary text-primary-foreground">
              {!flipped ? (
                <>
                  <div className="text-xs uppercase tracking-wider opacity-80">Deutsch</div>
                  <div className="font-display text-4xl font-extrabold mt-2">{current.artikel} {current.de}</div>
                  <div className="opacity-80 mt-2">Pl.: {current.plural}</div>
                  <div className="text-xs opacity-70 mt-6">Натисни, щоб перевернути</div>
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
              <Button variant="outline" onClick={() => { setFlipIdx((flipIdx - 1 + words.length) % words.length); setFlipped(false); }}>
                <ChevronLeft className="h-4 w-4 mr-1"/> Назад
              </Button>
              <Button variant="ghost" onClick={() => setFlipped(!flipped)}><RotateCw className="h-4 w-4 mr-1"/> Перевернути</Button>
              <Button className="bg-gradient-primary" onClick={() => { setFlipIdx((flipIdx + 1) % words.length); setFlipped(false); }}>
                Далі <ChevronRight className="h-4 w-4 ml-1"/>
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Vocab;
