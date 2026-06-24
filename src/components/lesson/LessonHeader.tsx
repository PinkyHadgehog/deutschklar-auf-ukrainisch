import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Clock, Crown, ChevronRight } from "lucide-react";
import type { LessonContent } from "@/content/lessons";

interface Props {
  lesson: LessonContent;
  progress: number;
  duration?: number;
  premium?: boolean;
}

const LessonHeader = ({ lesson, progress, duration, premium }: Props) => (
  <div>
    <Link to="/grammar" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
      <ArrowLeft className="h-4 w-4 mr-1" /> До граматики
    </Link>

    {/* Breadcrumb */}
    <nav className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground flex-wrap" aria-label="Breadcrumb">
      <Link to="/grammar" className="hover:text-foreground">Граматика</Link>
      <ChevronRight className="h-3 w-3" />
      <span className="text-foreground/70">{lesson.level}</span>
      <ChevronRight className="h-3 w-3" />
      <span className="text-foreground/70">{lesson.category}</span>
      <ChevronRight className="h-3 w-3" />
      <span className="text-foreground font-medium">{lesson.titleDe}</span>
    </nav>

    <div className="mt-3 flex items-center gap-2 flex-wrap">
      <Badge variant="secondary" className="bg-primary-soft text-primary border-0">{lesson.level}</Badge>
      <Badge variant="outline">{lesson.category}</Badge>
      <Badge variant="outline">Граматика</Badge>
      {duration && (
        <Badge variant="outline" className="gap-1"><Clock className="h-3 w-3"/> {duration} хв</Badge>
      )}
      {premium ? (
        <Badge className="bg-amber-500/10 text-amber-600 border-0 gap-1"><Crown className="h-3 w-3"/> Premium</Badge>
      ) : (
        <Badge className="bg-success/10 text-success border-0">Безкоштовно</Badge>
      )}
    </div>

    <h1 className="font-display text-3xl md:text-4xl font-extrabold mt-3">{lesson.titleDe}</h1>
    <p className="text-muted-foreground mt-1">{lesson.titleUk}</p>

    <Progress value={progress} className="h-2 mt-5" />
    <div className="text-xs text-muted-foreground mt-1.5">Прогрес лекції: {progress}%</div>
  </div>
);

export default LessonHeader;
