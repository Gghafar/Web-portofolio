import Image from "next/image";
import { photoSrc } from "./Gallery";
import { albumFor } from "@/data/gallery";
import { HOBBIES, OUTSIDE_INTRO } from "@/data/hobbies";

/** Life outside campus, written straight into About: a paragraph per hobby with its photos under it, read by scrolling. */
export function Hobbies() {
  const personal = albumFor("about");
  if (!personal) return null;

  return (
    <div className="about-life">
      <p>{OUTSIDE_INTRO}</p>
      {HOBBIES.map((h) => {
        const photos = h.photos.flatMap((f) => personal.photos.filter((p) => p.file === f));
        return (
          <div key={h.title} className="life">
            <p>
              <b>{h.title}.</b> {h.text}
            </p>
            {photos.length > 0 && (
              <figure className="life-photos">
                {photos.map((p) => (
                  <Image key={p.file} src={photoSrc(personal, p, true)} alt={p.alt} width={p.w} height={p.h} sizes="(max-width: 760px) 160px, 220px" />
                ))}
                <figcaption className="dv-note">{h.note}</figcaption>
              </figure>
            )}
          </div>
        );
      })}
    </div>
  );
}
