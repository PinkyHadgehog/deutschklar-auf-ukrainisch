import { Camera } from "lucide-react";

/**
 * Portrait placeholder for the personal-brand section.
 * Keeps a 4:5 vertical frame so a real professional photo can later be dropped in
 * via the optional `src` prop without changing the layout.
 */
export const OksiPortrait = ({ src, alt = "Оксі — засновниця deutsch.klar" }: { src?: string; alt?: string }) => (
  <div className="relative w-full max-w-sm mx-auto lg:mx-0">
    <div className="absolute -inset-4 bg-gradient-primary opacity-15 blur-3xl rounded-full" aria-hidden />
    <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl border border-primary/10 bg-primary-soft/50 shadow-elevated">
      {src ? (
        <img src={src} alt={alt} loading="lazy" className="h-full w-full object-cover" />
      ) : (
        <div className="h-full w-full grid place-items-center bg-gradient-to-br from-primary-soft via-secondary to-accent-soft">
          <div className="text-center px-6">
            <div className="h-14 w-14 rounded-2xl bg-card/80 grid place-items-center mx-auto shadow-soft">
              <Camera className="h-6 w-6 text-primary" />
            </div>
            <div className="font-display font-bold text-lg mt-4">Оксі</div>
            <p className="text-sm text-muted-foreground mt-1">Фото скоро буде тут</p>
          </div>
        </div>
      )}
    </div>
  </div>
);

export default OksiPortrait;
