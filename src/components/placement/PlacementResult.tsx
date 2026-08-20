import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, ArrowRight } from "lucide-react";
import { PLACEMENT_EVENTS, trackPlacementEvent } from "./placement";

export interface PlacementResultData {
  level: string;
  strengths: string[];
  improvements: string[];
  path: string;
  courseTitle: string;
  courseHref: string;
}

/**
 * Structural placeholder for the future placement-test result page.
 * Data is always passed in — never hardcoded on the public homepage.
 */
export const PlacementResult = ({ data }: { data: PlacementResultData }) => (
  <Card className="p-8 md:p-10 rounded-3xl border-0 shadow-elevated" data-component="placement-result">
    <div className="text-center">
      <div className="h-14 w-14 rounded-2xl bg-gradient-primary grid place-items-center mx-auto mb-4">
        <Trophy className="h-7 w-7 text-primary-foreground" />
      </div>
      <div className="text-sm text-muted-foreground">Твій орієнтовний рівень</div>
      <div className="font-display text-6xl font-extrabold text-gradient mt-1">{data.level}</div>
    </div>

    <div className="mt-8 grid sm:grid-cols-2 gap-3">
      <Card className="p-4 rounded-xl border-0 bg-success/10">
        <div className="text-xs uppercase text-success font-semibold">Сильні сторони</div>
        <ul className="mt-2 space-y-1 text-sm">{data.strengths.map((s) => <li key={s}>· {s}</li>)}</ul>
      </Card>
      <Card className="p-4 rounded-xl border-0 bg-accent-soft">
        <div className="text-xs uppercase text-accent-foreground font-semibold">Що варто покращити</div>
        <ul className="mt-2 space-y-1 text-sm">{data.improvements.map((s) => <li key={s}>· {s}</li>)}</ul>
      </Card>
    </div>

    <div className="mt-6 rounded-xl bg-primary-soft/60 p-4">
      <div className="text-xs uppercase text-primary font-semibold">Рекомендований навчальний шлях</div>
      <div className="font-semibold mt-1">{data.path}</div>
    </div>

    <div className="mt-3 rounded-xl bg-secondary/60 p-4">
      <div className="text-xs uppercase text-muted-foreground font-semibold">Рекомендований курс</div>
      <div className="font-semibold mt-1">{data.courseTitle}</div>
    </div>

    <div className="mt-8 flex flex-wrap justify-center gap-3">
      <Button
        asChild
        className="bg-gradient-primary hover:opacity-95"
        onClick={() => trackPlacementEvent(PLACEMENT_EVENTS.recommendedCourseClicked, { level: data.level })}
      >
        <Link to={data.courseHref}>Почати з {data.level} <ArrowRight className="ml-1.5 h-4 w-4" /></Link>
      </Button>
      <Button asChild variant="outline"><Link to="/courses">Переглянути курс</Link></Button>
    </div>
  </Card>
);
