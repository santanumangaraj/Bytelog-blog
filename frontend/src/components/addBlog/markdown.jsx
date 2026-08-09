import React from "react";

/* Tiny markdown-subset renderer. Only supports what the toolbar can produce,
   so the preview never shows formatting the stored content can't express. */

const inline = (text) => {
  const nodes = [];
  const re =
    /(\*\*[^*]+\*\*)|(\*[^*]+\*)|(`[^`]+`)|(\[[^\]]+\]\([^)]+\))/g;
  let last = 0;
  let m;
  let key = 0;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) nodes.push(text.slice(last, m.index));
    const t = m[0];
    if (t.startsWith("**")) {
      nodes.push(<strong key={key++}>{t.slice(2, -2)}</strong>);
    } else if (t.startsWith("`")) {
      nodes.push(
        <code key={key++} className="rounded bg-base-200 px-1.5 py-0.5 text-[0.9em]">
          {t.slice(1, -1)}
        </code>,
      );
    } else if (t.startsWith("[")) {
      const label = t.slice(1, t.indexOf("]"));
      const href = t.slice(t.indexOf("(") + 1, -1);
      nodes.push(
        <a
          key={key++}
          href={href}
          target="_blank"
          rel="noreferrer noopener"
          className="link link-primary break-words"
        >
          {label}
        </a>,
      );
    } else {
      nodes.push(<em key={key++}>{t.slice(1, -1)}</em>);
    }
    last = m.index + t.length;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
};

export const renderMarkdown = (src = "") => {
  const lines = String(src).replace(/\r\n/g, "\n").split("\n");
  const out = [];
  let i = 0;
  let key = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (line.trim() === "") {
      i += 1;
      continue;
    }

    if (line.startsWith("```")) {
      const body = [];
      i += 1;
      while (i < lines.length && !lines[i].startsWith("```")) {
        body.push(lines[i]);
        i += 1;
      }
      i += 1;
      out.push(
        <pre
          key={key++}
          className="my-5 overflow-x-auto rounded-2xl bg-base-200 p-4 text-sm"
        >
          <code>{body.join("\n")}</code>
        </pre>,
      );
      continue;
    }

    const heading = /^(#{1,3})\s+(.*)$/.exec(line);
    if (heading) {
      const level = heading[1].length;
      const cls =
        level === 1
          ? "font-barlow mt-8 mb-3 text-2xl font-bold sm:text-3xl"
          : level === 2
            ? "font-barlow mt-7 mb-3 text-xl font-bold sm:text-2xl"
            : "font-barlow mt-6 mb-2 text-lg font-bold sm:text-xl";
      const Tag = `h${level + 1}`;
      out.push(
        <Tag key={key++} className={`${cls} text-base-content`}>
          {inline(heading[2])}
        </Tag>,
      );
      i += 1;
      continue;
    }

    if (/^>\s?/.test(line)) {
      const body = [];
      while (i < lines.length && /^>\s?/.test(lines[i])) {
        body.push(lines[i].replace(/^>\s?/, ""));
        i += 1;
      }
      out.push(
        <blockquote
          key={key++}
          className="my-5 border-l-4 border-base-300 pl-4 text-base-content/80 italic"
        >
          {inline(body.join(" "))}
        </blockquote>,
      );
      continue;
    }

    if (/^[-*]\s+/.test(line) || /^\d+\.\s+/.test(line)) {
      const ordered = /^\d+\.\s+/.test(line);
      const items = [];
      const test = ordered ? /^\d+\.\s+/ : /^[-*]\s+/;
      while (i < lines.length && test.test(lines[i])) {
        items.push(lines[i].replace(test, ""));
        i += 1;
      }
      const ListTag = ordered ? "ol" : "ul";
      out.push(
        <ListTag
          key={key++}
          className={`my-4 space-y-1.5 pl-6 text-base-content/80 ${
            ordered ? "list-decimal" : "list-disc"
          }`}
        >
          {items.map((it, n) => (
            <li key={n}>{inline(it)}</li>
          ))}
        </ListTag>,
      );
      continue;
    }

    const para = [];
    while (
      i < lines.length &&
      lines[i].trim() !== "" &&
      !lines[i].startsWith("```") &&
      !/^(#{1,3})\s/.test(lines[i]) &&
      !/^>\s?/.test(lines[i]) &&
      !/^[-*]\s+/.test(lines[i]) &&
      !/^\d+\.\s+/.test(lines[i])
    ) {
      para.push(lines[i]);
      i += 1;
    }
    out.push(
      <p key={key++} className="my-4 leading-relaxed text-base-content/80">
        {inline(para.join(" "))}
      </p>,
    );
  }

  return out;
};

export default renderMarkdown;