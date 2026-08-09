import React, { useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeading,
  faBold,
  faItalic,
  faListUl,
  faListOl,
  faQuoteRight,
  faCode,
  faLink,
} from "@fortawesome/free-solid-svg-icons";
import FieldError from "./FieldError.jsx";

/* Markdown-subset editor: every control maps to plain text the backend
   can store as-is, so nothing here outruns what the API accepts. */
const CONTROLS = [
  { key: "h2", icon: faHeading, label: "Heading", wrap: ["## ", ""], line: true },
  { key: "bold", icon: faBold, label: "Bold", wrap: ["**", "**"] },
  { key: "italic", icon: faItalic, label: "Italic", wrap: ["*", "*"] },
  { key: "ul", icon: faListUl, label: "Bullet list", wrap: ["- ", ""], line: true },
  { key: "ol", icon: faListOl, label: "Numbered list", wrap: ["1. ", ""], line: true },
  { key: "quote", icon: faQuoteRight, label: "Quote", wrap: ["> ", ""], line: true },
  { key: "code", icon: faCode, label: "Code block", wrap: ["\n```\n", "\n```\n"] },
  { key: "link", icon: faLink, label: "Link", wrap: ["[", "](https://)"] },
];

const BlogContentEditor = ({ value, onChange, error }) => {
  const ref = useRef(null);

  const apply = (control) => {
    const el = ref.current;
    if (!el) return;
    const start = el.selectionStart ?? value.length;
    const end = el.selectionEnd ?? value.length;
    const selected = value.slice(start, end);
    const [before, after] = control.wrap;

    let insert;
    let caret;
    if (control.line) {
      const lineStart = value.lastIndexOf("\n", start - 1) + 1;
      const next = `${value.slice(0, lineStart)}${before}${value.slice(lineStart)}`;
      onChange(next);
      caret = start + before.length;
      requestAnimationFrame(() => {
        el.focus();
        el.setSelectionRange(caret, caret);
      });
      return;
    }

    insert = `${before}${selected}${after}`;
    onChange(`${value.slice(0, start)}${insert}${value.slice(end)}`);
    caret = start + before.length + selected.length;
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(caret, caret);
    });
  };

  const words = value.trim() ? value.trim().split(/\s+/).length : 0;

  return (
    <div className="card mt-6 overflow-hidden rounded-3xl bg-base-100 shadow-md">
      <div className="flex flex-wrap items-center gap-1 border-b border-base-300 bg-base-200/50 px-3 py-2">
        {CONTROLS.map((c) => (
          <button
            key={c.key}
            type="button"
            title={c.label}
            aria-label={c.label}
            onClick={() => apply(c)}
            className="btn btn-ghost btn-xs sm:btn-sm rounded-full text-base-content/70"
          >
            <FontAwesomeIcon icon={c.icon} className="text-xs" />
          </button>
        ))}
        <span className="ml-auto hidden text-xs text-base-content/50 sm:inline">
          Markdown supported
        </span>
      </div>

      <div className="p-5 sm:p-7">
        <label htmlFor="blog-content" className="sr-only">
          Blog content
        </label>
        <textarea
          id="blog-content"
          ref={ref}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={16}
          placeholder="Tell your story..."
          aria-invalid={Boolean(error)}
          className="w-full resize-y bg-transparent font-mono text-sm leading-relaxed text-base-content outline-none placeholder:text-base-content/35 sm:text-[15px]"
        />
        <div className="mt-4 flex items-center justify-between border-t border-base-300 pt-3 text-xs text-base-content/50">
          <span>{words} words</span>
          <span>{value.length} characters</span>
        </div>
        <FieldError message={error} />
      </div>
    </div>
  );
};

export default BlogContentEditor;