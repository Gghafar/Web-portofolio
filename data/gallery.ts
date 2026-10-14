/**
 * Documentation photos, one album per window. Files live in public/gallery/<folder>/ (web size, max 1600px)
 * with a 640px copy in <folder>/thumbs/ for the grids. To add a photo: drop both files in and add a line here.
 */

export type Photo = {
  /** File name inside the album folder. */
  file: string;
  /** What the photo shows (alt text and caption). */
  alt: string;
  /** "YYYY-MM-DD", from the photo itself. */
  date: string;
};

export type Album = {
  /** Window id the album belongs to ("photos" lists every album). */
  id: string;
  title: string;
  group: "Experience" | "Organizations" | "Personal";
  /** Folder under public/gallery/. */
  folder: string;
  photos: Photo[];
};

export const ALBUMS: Album[] = [
  {
    id: "pelni",
    title: "PT PELNI",
    group: "Experience",
    folder: "experience/pelni",
    photos: [{ file: "img-9278.jpg", alt: "Standing in front of a PELNI ship", date: "2026-07-10" }],
  },
  {
    id: "komdigi-ml",
    title: "Komdigi — ML Engineer",
    group: "Experience",
    folder: "experience/komdigi-ml",
    photos: [
      { file: "img-8082.jpg", alt: "The team on stage at the AI Talent Factory (AITF) 2026 Demo Day & Graduation", date: "2026-06-30" },
      { file: "img-8107.jpg", alt: "At the AITF 2026 Demo Day & Graduation", date: "2026-06-30" },
    ],
  },
  {
    id: "komdigi-it",
    title: "Komdigi — IT Intern",
    group: "Experience",
    folder: "experience/komdigi-it",
    photos: [{ file: "img-5197.jpg", alt: "At the Komdigi office, next to the ministry logo", date: "2026-02-26" }],
  },
  {
    id: "elite",
    title: "Elite x Pesraf",
    group: "Organizations",
    folder: "organizations/elite",
    photos: [
      { file: "img-3952.jpg", alt: "Elite x Pesraf crew in the EXP team jerseys", date: "2025-06-01" },
      { file: "img-2045.jpg", alt: "With the operations team at the venue", date: "2025-09-13" },
      { file: "img-6256.jpg", alt: "The full Elite x Pesraf committee", date: "2025-09-13" },
    ],
  },
  {
    id: "ideas",
    title: "IDEAS 2025",
    group: "Organizations",
    folder: "organizations/ideas",
    photos: [{ file: "img-2937.jpg", alt: "At the Electics & Medics booth (FTEIC × FKK)", date: "2025-01-25" }],
  },
  {
    id: "inclenation",
    title: "Inclenation 2024",
    group: "Organizations",
    folder: "organizations/inclenation",
    photos: [
      { file: "img-0272.jpg", alt: "Mentor group holding up their team boards", date: "2024-08-07" },
      { file: "img-0337.jpg", alt: "Group photo with the mentees", date: "2024-08-08" },
      { file: "img-0469.jpg", alt: "With a fellow mentor in the Inclenation 2024 shirt", date: "2024-08-13" },
    ],
  },
  {
    id: "about",
    title: "Personal",
    group: "Personal",
    folder: "personal",
    photos: [
      { file: "img-1460.jpg", alt: "Bank Jatim JConnect Run Soeraraja, 10K, bib 3636", date: "2025-09-26" },
      { file: "img-5191.jpg", alt: "With friends at a hydropower plant", date: "2025-10-30" },
      { file: "img-9905.jpg", alt: "Tennis with friends", date: "2026-04-25" },
      { file: "img-7273.jpg", alt: "On the trail to the Mt. Butak summit", date: "2026-05-03" },
      { file: "img-7521.jpg", alt: "The hiking group at the Mt. Butak summit sign", date: "2026-05-03" },
      { file: "img-0848.jpg", alt: "With friends after a game on the court", date: "2026-06-14" },
    ],
  },
];

export const albumFor = (id: string) => ALBUMS.find((a) => a.id === id);
