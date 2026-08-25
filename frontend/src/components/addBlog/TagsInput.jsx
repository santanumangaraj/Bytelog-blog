import React from "react";
import { PINK } from "../blog/blogUi.jsx";
import FieldError from "./FieldError.jsx";

const MAX_TAGS = 5;

/* Tags are a fixed, admin-curated list (backend/seeders/seedTags.js) — this
   is a picker over `availableTags`, not a free-text field, so a blog can
   only ever carry a tag that already exists. */
const TagsInput = ({ value = [], onChange, availableTags = [], error }) => {
  const atLimit = value.length >= MAX_TAGS;

  const toggleTag = (slug) => {
    if (value.includes(slug)) {
      onChange(value.filter((s) => s !== slug));
      return;
    }
    if (atLimit) return;
    onChange([...value, slug]);
  };

  return (
    <div className="mt-5">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-base-content">Tags</span>
        <span className="text-xs text-base-content/50">
          {value.length}/{MAX_TAGS}
        </span>
      </div>

      {availableTags.length === 0 ? (
        <p className="mt-2 text-xs text-base-content/50">No tags available yet.</p>
      ) : (
        <div className="mt-2 flex flex-wrap gap-2">
          {availableTags.map((tag) => {
            const active = value.includes(tag.slug);
            const disabled = !active && atLimit;
            return (
              <button
                key={tag.slug}
                type="button"
                onClick={() => toggleTag(tag.slug)}
                disabled={disabled}
                aria-pressed={active}
                className={`btn btn-sm rounded-full font-semibold transition ${
                  active
                    ? "border-0 text-white shadow-md"
                    : "btn-ghost border border-base-300 text-base-content/70"
                } ${disabled ? "opacity-40" : ""}`}
                style={active ? { backgroundColor: PINK } : undefined}
              >
                {tag.name}
              </button>
            );
          })}
        </div>
      )}

      <p className="mt-2 text-xs text-base-content/55">
        Pick up to {MAX_TAGS} tags that fit your post.
      </p>
      <FieldError message={error} />
    </div>
  );
};

export default TagsInput;
