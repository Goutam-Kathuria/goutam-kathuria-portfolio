import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useMemo, useState, type CSSProperties } from "react";

export type ProjectMedia = {
  type: "image" | "video";
  src: string;
  alt?: string;
  label?: string;
};

export type ProjectSceneProps = {
  /** A single, stable cover image (used in the homepage work sequence). */
  image?: string;
  /** Multiple images/videos are rendered as a click-driven gallery on a case-study page. */
  media?: ProjectMedia[];
  title: string;
  accent: string;
  index: string;
  category?: string;
  total?: string;
  interactive?: boolean;
};

type Artwork = Pick<ProjectSceneProps, "image" | "media" | "title" | "accent" | "index" | "category" | "total">;
type Direction = "next" | "previous";

function kindFor(artwork: Artwork) {
  const normalized = `${artwork.title} ${artwork.category ?? ""}`.toLowerCase();
  if (normalized.includes("hospital")) return "hospital";
  if (normalized.includes("fivlia") || normalized.includes("commerce")) return "commerce";
  return "automation";
}

function defaultMediaFor(artwork: Artwork): ProjectMedia[] {
  const kind = kindFor(artwork);
  const base = "/assets/projects/default";
  const prefix = kind === "hospital" ? "samarpan" : kind === "commerce" ? "fivlia" : "automation";
  return [1, 2, 3].map((n) => ({
    type: "image" as const,
    src: `${base}/${prefix}-${String(n).padStart(2, "0")}.svg`,
    alt: `${artwork.title} project view ${n}`,
    label: `VIEW ${String(n).padStart(2, "0")}`,
  }));
}

function mediaFor(artwork: Artwork): ProjectMedia[] {
  if (artwork.media?.length) return artwork.media;
  if (artwork.image) return [{ type: "image", src: artwork.image, alt: `${artwork.title} project preview`, label: "PROJECT PREVIEW" }];
  return defaultMediaFor(artwork);
}

function ArtworkLayer({
  artwork,
  layer,
  activeMediaIndex = 0,
  previousMediaIndex = null,
  mediaChanging = false,
  direction = "next",
  interactive = false,
  onChangeMedia,
  transitionMediaCount = mediaFor(artwork).length,
  activeLabel = "IMAGE",
}: {
  artwork: Artwork;
  layer: "current" | "incoming";
  activeMediaIndex?: number;
  previousMediaIndex?: number | null;
  mediaChanging?: boolean;
  direction?: Direction;
  interactive?: boolean;
  onChangeMedia?: (index: number, direction: Direction) => void;
  transitionMediaCount?: number;
  activeLabel?: string;
}) {
  const media = mediaFor(artwork);
  return (
    <div className={`project-artwork-layer ${layer}`} style={{ "--art-accent": artwork.accent } as CSSProperties} aria-hidden={layer === "incoming" || !interactive}>
      <div className="project-artwork-shade" />
      <div className="project-artwork-grid" />
      <div className="project-artwork-media">
        <div className="project-artwork-top"><span>{interactive ? "PROJECT / MEDIA GALLERY" : "PROJECT / PREVIEW"}</span><span>{artwork.index} / {artwork.total ?? "04"}</span></div>
        {media.map((item, index) => {
          const isActive = index === activeMediaIndex;
          const isLeaving = mediaChanging && index === previousMediaIndex && index !== activeMediaIndex;
          const slideClass = [
            "project-media-slide",
            isActive ? "is-active" : "",
            isLeaving ? `is-leaving direction-${direction}` : "",
          ].filter(Boolean).join(" ");
          return (
            <div className={slideClass} key={`${item.src}-${index}`} data-media-slide={index} aria-hidden={!isActive}>
              {item.label && <span className="project-media-label">{item.label}</span>}
              {item.type === "video" ? (
                <video
                  src={item.src}
                  muted
                  playsInline
                  autoPlay={interactive && isActive}
                  loop
                  controls={interactive && isActive}
                  preload={index === 0 ? "metadata" : "none"}
                  aria-label={item.alt ?? artwork.title}
                />
              ) : (
                <img src={item.src} alt={isActive ? item.alt ?? `${artwork.title} preview` : ""} loading={index === 0 ? "eager" : "lazy"} decoding="async" />
              )}
            </div>
          );
        })}
        <div className="project-artwork-frame-line" />
        <div className="project-artwork-bottom"><span>{artwork.title}</span><span>{interactive ? "SELECT A VIEW" : "PROJECT COVER"}</span></div>
        {interactive && media.length > 1 && onChangeMedia && (
          <div className="project-gallery-controls" aria-label="Project screenshots and videos">
            <button type="button" className="project-gallery-arrow" aria-label="Previous image or video" onClick={() => onChangeMedia(activeMediaIndex - 1, "previous")} disabled={mediaChanging}>
              <ChevronLeft size={18} />
            </button>
            <div className="project-media-pagination" role="group" aria-label="Choose project media">
              {media.map((item, itemIndex) => (
                <button
                  type="button"
                  aria-pressed={itemIndex === activeMediaIndex}
                  aria-label={`Show ${item.label || `${item.type} ${itemIndex + 1}`}`}
                  className={itemIndex === activeMediaIndex ? "is-active" : ""}
                  key={`${item.src}-dot-${itemIndex}`}
                  onClick={() => onChangeMedia(itemIndex, itemIndex > activeMediaIndex ? "next" : "previous")}
                  disabled={mediaChanging || itemIndex === activeMediaIndex}
                />
              ))}
            </div>
            <div className="project-gallery-current"><span>{activeLabel}</span><b>{String(activeMediaIndex + 1).padStart(2, "0")}<i>/</i>{String(transitionMediaCount).padStart(2, "0")}</b></div>
            <button type="button" className="project-gallery-arrow" aria-label="Next image or video" onClick={() => onChangeMedia(activeMediaIndex + 1, "next")} disabled={mediaChanging}>
              <ChevronRight size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ProjectScene({ image, media, title, accent, index, category, total = "04", interactive = false }: ProjectSceneProps) {
  const nextArtwork: Artwork = useMemo(() => ({ image, media, title, accent, index, category, total }), [image, media, title, accent, index, category, total]);
  const [current, setCurrent] = useState<Artwork>(nextArtwork);
  const [incoming, setIncoming] = useState<Artwork | null>(null);
  const [changing, setChanging] = useState(false);
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  const [previousMediaIndex, setPreviousMediaIndex] = useState<number | null>(null);
  const [mediaChanging, setMediaChanging] = useState(false);
  const [direction, setDirection] = useState<Direction>("next");
  const [transitionId, setTransitionId] = useState(0);

  const currentMedia = useMemo(() => mediaFor(current), [current]);
  const visibleMediaCount = Math.max(1, currentMedia.length);

  useEffect(() => {
    const same = current.image === image && current.media === media && current.title === title && current.accent === accent && current.index === index && current.category === category && current.total === total;
    if (same) return;
    setIncoming(nextArtwork);
    setChanging(false);
    const raf = window.requestAnimationFrame(() => setChanging(true));
    const timeout = window.setTimeout(() => {
      setCurrent(nextArtwork);
      setIncoming(null);
      setChanging(false);
    }, 1040);
    return () => {
      window.cancelAnimationFrame(raf);
      window.clearTimeout(timeout);
    };
  }, [image, media, title, accent, index, category, total, current.image, current.media, current.title, current.accent, current.index, current.category, current.total, nextArtwork]);

  useEffect(() => {
    setActiveMediaIndex(0);
    setPreviousMediaIndex(null);
    setMediaChanging(false);
  }, [title, index]);

  useEffect(() => {
    if (!mediaChanging) return;
    const timeout = window.setTimeout(() => {
      setPreviousMediaIndex(null);
      setMediaChanging(false);
    }, 1050);
    return () => window.clearTimeout(timeout);
  }, [mediaChanging, transitionId]);

  useEffect(() => {
    const root = document.querySelector<HTMLElement>(".project-scene.is-interactive-gallery");
    if (!root) return;
    root.querySelectorAll<HTMLVideoElement>(".project-media-slide video").forEach((video) => {
      if (video.closest(".project-media-slide")?.classList.contains("is-active")) {
        if (video.autoplay) void video.play().catch(() => undefined);
      } else {
        video.pause();
        try { video.currentTime = 0; } catch { /* ignore unavailable media metadata */ }
      }
    });
  }, [activeMediaIndex, interactive, current, incoming]);

  const changeMedia = (nextIndex: number, nextDirection: Direction) => {
    if (!interactive || mediaChanging || visibleMediaCount <= 1) return;
    const normalized = (nextIndex + visibleMediaCount) % visibleMediaCount;
    if (normalized === activeMediaIndex) return;
    setPreviousMediaIndex(activeMediaIndex);
    setDirection(nextDirection);
    setMediaChanging(true);
    setActiveMediaIndex(normalized);
    setTransitionId((value) => value + 1);
  };

  const activeLabel = currentMedia[activeMediaIndex]?.label || (currentMedia[activeMediaIndex]?.type === "video" ? "VIDEO" : "IMAGE");

  return (
    <div
      className={`project-scene project-artwork ${changing ? "is-changing" : ""} ${interactive ? "is-interactive-gallery" : ""} ${mediaChanging ? `is-media-changing direction-${direction}` : ""}`}
      style={{ "--art-accent": current.accent } as CSSProperties}
      role={interactive ? "group" : undefined}
      aria-label={interactive ? `${current.title} media gallery` : undefined}
      aria-roledescription={interactive ? "media gallery" : undefined}
      aria-live={interactive ? "polite" : undefined}
    >
      <ArtworkLayer
        artwork={current}
        layer="current"
        activeMediaIndex={activeMediaIndex}
        previousMediaIndex={previousMediaIndex}
        mediaChanging={mediaChanging}
        direction={direction}
        interactive={interactive}
        onChangeMedia={changeMedia}
        transitionMediaCount={visibleMediaCount}
        activeLabel={activeLabel}
      />
      {incoming && <ArtworkLayer artwork={incoming} layer="incoming" />}

    </div>
  );
}
