"use client";

import Image from "next/image";
import { useState } from "react";
import { Dialog } from "radix-ui";
import { OpenLink } from "./views";
import { ALBUMS, type Album, type Photo } from "@/data/gallery";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** "2025-09-13" → "13 Sep 2025" (by hand, so server and browser render the same text). */
function formatDate(date: string) {
  const [y, m, d] = date.split("-").map(Number);
  return `${d} ${MONTHS[m - 1]} ${y}`;
}

const photoSrc = (a: Album, p: Photo, thumb = false) => `/gallery/${a.folder}/${thumb ? "thumbs/" : ""}${p.file}`;

/** A grid of square thumbnails; clicking one opens it full screen. */
export function PhotoGrid({ album }: { album: Album }) {
  const [open, setOpen] = useState<number | null>(null);
  const n = album.photos.length;
  const step = (by: number) => setOpen((i) => (i === null ? i : (i + by + n) % n));
  const photo = open === null ? null : album.photos[open];

  return (
    <>
      <ul className="photos">
        {album.photos.map((p, i) => (
          <li key={p.file}>
            <button type="button" className="photo-btn" onClick={() => setOpen(i)} aria-label={`View photo: ${p.alt}`}>
              <Image src={photoSrc(album, p, true)} alt="" fill sizes="(max-width: 760px) 33vw, 160px" />
            </button>
          </li>
        ))}
      </ul>

      <Dialog.Root open={photo !== null} onOpenChange={(o) => !o && setOpen(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="lb-overlay" />
          <Dialog.Content
            className="lb"
            aria-describedby={undefined}
            onKeyDown={(e) => {
              if (e.key === "ArrowRight") step(1);
              else if (e.key === "ArrowLeft") step(-1);
            }}
            // A click on the dark space around the photo closes it, like the overlay would.
            onClick={(e) => e.target === e.currentTarget && setOpen(null)}
          >
            {photo && (
              <>
                <div className="lb-bar">
                  <Dialog.Title className="lb-title">
                    {album.title} · {open! + 1} / {n}
                  </Dialog.Title>
                  <Dialog.Close className="lb-btn" aria-label="Close">
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                      <path d="M6 6l12 12M18 6 6 18" />
                    </svg>
                  </Dialog.Close>
                </div>
                <div className="lb-stage" onClick={(e) => e.target === e.currentTarget && setOpen(null)}>
                  <Image key={photo.file} src={photoSrc(album, photo)} alt={photo.alt} fill sizes="100vw" priority />
                </div>
                <p className="lb-cap">
                  {photo.alt}
                  <span>{formatDate(photo.date)}</span>
                </p>
                {n > 1 && (
                  <>
                    <button type="button" className="lb-btn lb-prev" onClick={() => step(-1)} aria-label="Previous photo">
                      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M15 5l-7 7 7 7" />
                      </svg>
                    </button>
                    <button type="button" className="lb-btn lb-next" onClick={() => step(1)} aria-label="Next photo">
                      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </>
                )}
              </>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}

/** The photo block in a window: "Documentation" for experience and organizations, the personal album in About. */
export function AlbumSection({ album, title = "Documentation" }: { album: Album; title?: string }) {
  return (
    <section className="album">
      <h3 className="album-head">
        <span>{title}</span>
        <OpenLink to="photos" className="dv-note">
          All photos →
        </OpenLink>
      </h3>
      <PhotoGrid album={album} />
    </section>
  );
}

/** The Photos app: every album, newest work first, each heading opening the window it documents. */
export function PhotosView() {
  return (
    <div className="dv">
      <span className="dv-kicker">Photos</span>
      <h2 className="dv-title">Documentation</h2>
      <p className="dv-meta">Photos from work, campus organizations and life outside them. Click one to enlarge it.</p>
      {ALBUMS.map((a) => (
        <section key={a.id} className="album">
          <h3 className="album-head">
            <OpenLink to={a.id}>{a.title}</OpenLink>
            <span className="dv-note">
              {a.group} · {a.photos.length} {a.photos.length === 1 ? "photo" : "photos"}
            </span>
          </h3>
          <PhotoGrid album={a} />
        </section>
      ))}
    </div>
  );
}
