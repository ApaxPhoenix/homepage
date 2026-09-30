// Book citations in MLA 9 and APA 7. Output is a list of runs so the title can
// be italicised on screen and still copied as plain text.

export type CiteFields = { authors: string[]; title: string; publisher: string; year: string };
export type Run = { text: string; italic?: boolean };
export type Style = "MLA" | "APA";

function split(name: string) {
  const parts = name.trim().split(/\s+/);
  const last = parts.pop() ?? "";
  return { first: parts.join(" "), last };
}

const end = (s: string) => (/[.?!]$/.test(s) ? s : `${s}.`);

function mlaAuthors(authors: string[]) {
  if (authors.length === 0) return "";
  const { first, last } = split(authors[0]);
  const lead = first ? `${last}, ${first}` : last;
  if (authors.length === 1) return end(lead) + " ";
  if (authors.length === 2) return end(`${lead}, and ${authors[1]}`) + " ";
  return `${lead}, et al. `;
}

function apaName(name: string) {
  const { first, last } = split(name);
  const initials = first
    .split(/[\s-]+/)
    .filter(Boolean)
    .map((p) => `${p[0].toUpperCase()}.`)
    .join(" ");
  return initials ? `${last}, ${initials}` : last;
}

function apaAuthors(authors: string[]) {
  if (authors.length === 0) return "";
  const names = authors.slice(0, 20).map(apaName);
  if (names.length === 1) return names[0] + " ";
  return `${names.slice(0, -1).join(", ")}, & ${names[names.length - 1]} `;
}

// APA uses sentence case for book titles; keep the first word, the word after
// a colon, and anything that looks like a proper noun (all caps) intact.
function sentenceCase(title: string) {
  return title
    .split(/(:\s+)/)
    .map((chunk) =>
      chunk
        .split(" ")
        .map((w, i) => (i === 0 || /^[A-Z]{2,}$/.test(w) ? w : w.toLowerCase()))
        .join(" "),
    )
    .join("");
}

export function cite(style: Style, f: CiteFields): Run[] {
  const title = f.title.trim() || "Untitled";
  const publisher = f.publisher.trim();
  const year = f.year.trim();
  if (style === "MLA") {
    const tail = [publisher, year].filter(Boolean).join(", ");
    return [{ text: mlaAuthors(f.authors) }, { text: end(title), italic: true }, { text: tail ? ` ${end(tail)}` : "" }];
  }
  const who = apaAuthors(f.authors);
  const when = `(${year || "n.d."}). `;
  return [
    { text: who ? `${who}${when}` : "" },
    { text: end(sentenceCase(title)), italic: true },
    { text: who ? "" : ` ${when.trim()}` },
    { text: publisher ? ` ${end(publisher)}` : "" },
  ];
}

export const plain = (runs: Run[]) => runs.map((r) => r.text).join("").trim();
