import { SITE } from "../data";

// Follett catalog search for a title (plus author, to narrow it down).
export const catalogUrl = (title: string, author = "") =>
  SITE.catalogSearch + encodeURIComponent(`${title} ${author}`.trim());
