import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Compass, ArrowRight } from "lucide-react";
import { PLACEMENT_ROUTE, PLACEMENT_META_SHORT, PLACEMENT_EVENTS, trackPlacementEvent } from "./placement";

interface PlacementCtaCardProps {
  headline: string;
  text: string;
  buttonLabel: string;
  meta?: string;
  source: string;
}

export const PlacementCtaCard = ({ headline, text, buttonLabel, meta = PLACEMENT_META_SHORT, source }: PlacementCtaCardProps) => (
  <Card
    data-cta="placement-test"
    data-cta-source={source}
    className="p-6 md:p-8 rounded-2xl border-0 shadow-soft bg-primary-soft/60 flex flex-col md:flex-row md:items-center gap-5"
  >
    <div className="h-12 w-12 shrink-0 rounded-xl bg-gradient-primary grid place-items-center">
      <Compass className="h-6 w-6 text-primary-foreground" />
    </div>
    <div className="flex-1">
      <h3 className="font-display font-bold text-xl">{headline}</h3>
      <p className="text-muted-foreground mt-1.5">{text}</p>
      <p className="text-xs text-muted-foreground/80 mt-2">{meta}</p>
    </div>
    <Button
      asChild
      size="lg"
      className="bg-gradient-primary hover:opacity-95 shadow-soft shrink-0"
      onClick={() => trackPlacementEvent(PLACEMENT_EVENTS.ctaClicked, { source })}
    >
      <Link to={PLACEMENT_ROUTE}>{buttonLabel} <ArrowRight className="ml-1.5 h-4 w-4" /></Link>
    </Button>
  </Card>
);
