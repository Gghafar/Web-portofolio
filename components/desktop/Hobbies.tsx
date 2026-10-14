"use client";

import Image from "next/image";
import { useState } from "react";
import { Lightbox, photoSrc } from "./Gallery";
import { albumFor, type Album } from "@/data/gallery";
import { HOBBIES, OUTSIDE_INTRO, type Hobby } from "@/data/hobbies";

/** One hobby: a cover photo (opens the hobby's photos full screen), its name and a line about it. */
function HobbyCard({ hobby, personal }: { hobby: Hobby; personal: Album }) {
  const [open, setOpen] = useState<number | null>(null);
  // The hobby's own little album, so the viewer only steps through its photos.
  const album: Album = {
    ...personal,
    title: hobby.title,
    photos: hobby.photos.flatMap((f) => personal.photos.filter((p) => p.file === f)),
  };
  const cover = album.photos[0];
  if (!cover) return null;

  return (
    <li className="hobby">
      <button type="button" className="hobby-photo" onClick={() => setOpen(0)} aria-label={`View ${hobby.title.toLowerCase()} photos`}>
        <Image src={photoSrc(album, cover, true)} alt="" fill sizes="(max-width: 760px) 100vw, 280px" />
        {album.photos.length > 1 && <span className="hobby-count">+{album.photos.length - 1}</span>}
      </button>
      <div className="hobby-text">
        <h4>{hobby.title}</h4>
        <p>{hobby.text}</p>
        <span className="dv-note">{hobby.note}</span>
      </div>
      <Lightbox album={album} open={open} onOpen={setOpen} />
    </li>
  );
}

/** "Outside campus" in About: a short intro, then one card per hobby. */
export function Hobbies() {
  const personal = albumFor("about");
  if (!personal) return null;

  return (
    <section className="album">
      <h3 className="album-head">
        <span>Outside campus</span>
      </h3>
      <p className="hobbies-intro">{OUTSIDE_INTRO}</p>
      <ul className="hobbies">
        {HOBBIES.map((h) => (
          <HobbyCard key={h.title} hobby={h} personal={personal} />
        ))}
      </ul>
    </section>
  );
}
