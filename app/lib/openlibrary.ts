// Open Library (openlibrary.org) — free, keyless and CORS-enabled, so the
// static site can call it straight from the browser.

export type Book = {
  key: string;
  title: string;
  authors: string[];
  year?: number;
  publisher?: string;
  coverId?: number;
  isbn?: string;
};

const FIELDS = [
  "key",
  "title",
  "author_name",
  "cover_i",
  "first_publish_year",
  "editions",
  "editions.publisher",
  "editions.publish_date",
].join(",");

type Doc = {
  key: string;
  title: string;
  author_name?: string[];
  cover_i?: number;
  first_publish_year?: number;
  editions?: { docs?: { publisher?: string[]; publish_date?: string[] }[] };
};

function toBook(d: Doc): Book {
  // lang=en makes Open Library pick an English edition, which gives citations
  // a sensible publisher and year.
  const ed = d.editions?.docs?.[0];
  const edYear = ed?.publish_date?.[0]?.match(/\d{4}/)?.[0];
  return {
    key: d.key,
    title: d.title,
    authors: d.author_name ?? [],
    year: edYear ? Number(edYear) : d.first_publish_year,
    publisher: ed?.publisher?.[0],
    coverId: d.cover_i,
  };
}

export async function searchBooks(q: string, opts: { sort?: "rating"; limit?: number; signal?: AbortSignal } = {}) {
  const params = new URLSearchParams({ q, lang: "en", fields: FIELDS, limit: String(opts.limit ?? 12) });
  if (opts.sort) params.set("sort", opts.sort);
  const res = await fetch(`https://openlibrary.org/search.json?${params}`, { signal: opts.signal });
  if (!res.ok) throw new Error(`Open Library responded ${res.status}`);
  const data = (await res.json()) as { docs: Doc[] };
  return data.docs.map(toBook);
}

export function coverUrl(book: Pick<Book, "coverId" | "isbn">, size: "S" | "M" | "L" = "M") {
  if (book.coverId) return `https://covers.openlibrary.org/b/id/${book.coverId}-${size}.jpg`;
  if (book.isbn) return `https://covers.openlibrary.org/b/isbn/${book.isbn}-${size}.jpg?default=false`;
  return null;
}

export const workUrl = (key: string) => `https://openlibrary.org${key}`;
