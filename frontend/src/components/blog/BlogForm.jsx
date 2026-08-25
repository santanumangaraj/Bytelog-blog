import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faEye } from "@fortawesome/free-solid-svg-icons";
import { CYAN, PINK } from "./blogUi.jsx";
import BlogTitleInput from "../addBlog/BlogTitleInput.jsx";
import BlogExcerpt from "../addBlog/BlogExcerpt.jsx";
import BlogContentEditor from "../addBlog/BlogContentEditor.jsx";
import BlogCoverUpload from "../addBlog/BlogCoverUpload.jsx";
import BlogSettings from "../addBlog/BlogSettings.jsx";
import BlogPreview from "../addBlog/BlogPreview.jsx";

/* Shared writing surface for Create Blog and Edit Blog so both pages stay
   visually identical and only their headers/actions differ. */
const BlogForm = ({
  form,
  status,
  errors,
  mode,
  onModeChange,
  onFieldChange,
  coverFile,
  coverPreviewUrl,
  onCoverSelect,
  onCoverRemove,
  author,
  tags = [],
  onTagsChange,
  availableTags,
}) => (
  <>
    <div className="mt-6 flex justify-center lg:justify-start">
      <div className="join rounded-full bg-base-100 p-1 shadow-md">
        {[
          { key: "edit", label: "Edit", icon: faPen },
          { key: "preview", label: "Preview", icon: faEye },
        ].map((tab) => {
          const active = mode === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => onModeChange(tab.key)}
              aria-pressed={active}
              className={`btn btn-sm join-item gap-2 rounded-full px-5 font-semibold transition ${
                active ? "border-0 text-white" : "btn-ghost text-base-content/70"
              }`}
              style={
                active
                  ? { backgroundImage: `linear-gradient(135deg, ${CYAN}, ${PINK})` }
                  : undefined
              }
            >
              <FontAwesomeIcon icon={tab.icon} className="text-xs" />
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>

    {mode === "preview" ? (
      <div className="mt-8">
        <BlogPreview
          title={form.title}
          excerpt={form.excerpt}
          content={form.content}
          coverUrl={coverPreviewUrl}
          author={author}
          // blogType={form.blog_type}
          status={status}
          tags={tags.map(
            (slug) => availableTags?.find((t) => t.slug === slug)?.name ?? slug,
          )}
        />
      </div>
    ) : (
      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,7fr)_minmax(0,3fr)]">
        <div className="min-w-0">
          <BlogTitleInput
            value={form.title}
            onChange={(v) => onFieldChange("title", v)}
            error={errors.title}
          />
          <BlogExcerpt
            value={form.excerpt}
            onChange={(v) => onFieldChange("excerpt", v)}
            error={errors.excerpt}
          />
          <BlogContentEditor
            value={form.content}
            onChange={(v) => onFieldChange("content", v)}
            error={errors.content}
          />
        </div>

        <aside className="min-w-0">
          <BlogCoverUpload
            file={coverFile}
            previewUrl={coverPreviewUrl}
            onSelect={onCoverSelect}
            onRemove={onCoverRemove}
            error={errors.coverImage}
          />
          <BlogSettings
            // blogType={form.blog_type}
            status={status}
            // onBlogTypeChange={(v) => onFieldChange("blog_type", v)}
            onStatusChange={(v) => onFieldChange("status", v)}
            // error={errors.blog_type}
            tags={tags}
            onTagsChange={onTagsChange}
            tagsError={errors.tags}
            availableTags={availableTags}
          />
        </aside>
      </div>
    )}
  </>
);

export default BlogForm;