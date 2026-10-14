/**
 * Life outside campus, shown in the About window: who I am beyond being an ITS student.
 * `photos` are file names from the personal album (the "about" album in data/gallery.ts), shown in this order.
 */

export type Hobby = {
  title: string;
  text: string;
  /** Short mono line under the photos: event, place or date. */
  note: string;
  photos: string[];
};

export const OUTSIDE_INTRO =
  "Outside lectures at ITS and my work in AI, I like to keep moving: on a running route, up a mountain, or on a court with friends.";

export const HOBBIES: Hobby[] = [
  {
    title: "Running",
    text: "I run distance events. My latest was the 10K national category at Bank Jatim JConnect Run Soeraraja in Surabaya.",
    note: "10K · Sep 2025",
    photos: ["img-1460.jpg"],
  },
  {
    title: "Hiking",
    text: "Climbing mountains with friends. The most recent trip ended at the summit of Mt. Butak.",
    note: "Mt. Butak · May 2026",
    photos: ["img-7521.jpg", "img-7273.jpg"],
  },
  {
    title: "Racket sports",
    text: "Tennis and padel, mostly in sessions with friends.",
    note: "Tennis · Padel",
    photos: ["img-9905.jpg", "img-0848.jpg"],
  },
  {
    title: "Exploring",
    text: "Getting out with friends to see new places, like a hydropower plant.",
    note: "Oct 2025",
    photos: ["img-5191.jpg"],
  },
];
