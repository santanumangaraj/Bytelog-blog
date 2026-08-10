import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faEye, faCircleExclamation, faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import { createBlog } from "../routes/api.js";
import { useAuth } from "../context/AuthContext.jsx";
import { CYAN, PINK } from "../components/blog/blogUi.jsx";
import AddBlogHeader from "../components/addBlog/AddBlogHeader.jsx";
import BlogTitleInput from "../components/addBlog/BlogTitleInput.jsx";
import BlogExcerpt from "../components/addBlog/BlogExcerpt.jsx";
import BlogContentEditor from "../components/addBlog/BlogContentEditor.jsx";
import BlogCoverUpload, { validateCoverFile } from "../components/addBlog/BlogCoverUpload.jsx";
import BlogSettings from "../components/addBlog/BlogSettings.jsx";
import BlogPreview from "../components/addBlog/BlogPreview.jsx";
import { getApiErrorMessage, getFieldErrors } from "../components/addBlog/apiError.js";

const INITIAL_FORM = {
  title: "",
  excerpt: "",
  content: "",
  // blog_type: "",
  status: "draft",
};

const AddBlog = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [form, setForm] = useState(INITIAL_FORM);
  const [coverFile, setCoverFile] = useState(null);
  const [coverUrl, setCoverUrl] = useState("");
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [success, setSuccess] = useState("");
  const [mode, setMode] = useState("edit");
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [savedAt, setSavedAt] = useState(null);
  const submitting = useRef(false);

  const setField = useCallback((key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => (prev[key] ? { ...prev, [key]: undefined } : prev));
    setSavedAt(null);
  }, []);

  /* object URL lifecycle for the cover preview */
  useEffect(() => {
    if (!coverFile) {
      setCoverUrl("");
      return undefined;
    }
    const url = URL.createObjectURL(coverFile);
    setCoverUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [coverFile]);

  const isDirty = useMemo(
    () =>
      Boolean(
        form.title.trim() ||
          form.excerpt.trim() ||
          form.content.trim() ||
          // form.blog_type ||
          coverFile,
      ),
    [form, coverFile],
  );

  /* unsaved-changes warning (browser-level, no extra state library) */
  useEffect(() => {
    if (!isDirty || savedAt) return undefined;
    const handler = (e) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [isDirty, savedAt]);

  if (!user) {
    return <Navigate to="/login" replace state={{ from: "/add" }} />;
  }

  const handleCoverSelect = (file) => {
    const message = validateCoverFile(file);
    if (message) {
      setErrors((prev) => ({ ...prev, coverImage: message }));
      return;
    }
    setErrors((prev) => ({ ...prev, coverImage: undefined }));
    setCoverFile(file);
    setSavedAt(null);
  };

  const validate = (forPublish) => {
    const next = {};
    if (!form.title.trim()) next.title = "Title is required.";
    else if (form.title.trim().length < 5)
      next.title = "Title should be at least 5 characters.";

    if (forPublish) {
      if (!form.content.trim()) next.content = "Blog content is required.";
      else if (form.content.trim().length < 50)
        next.content = "Write at least 50 characters before publishing.";
      if (!form.excerpt.trim()) next.excerpt = "Excerpt is required to publish.";
      // if (!form.blog_type) next.blog_type = "Choose a blog type.";
      if (!coverFile) next.coverImage = "A cover image is required to publish.";
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = async (status) => {
    if (submitting.current) return;

    const forPublish = status === "published";
    setFormError("");
    setSuccess("");

    if (!validate(forPublish)) {
      setFormError("Please fix the highlighted fields.");
      setMode("edit");
      return;
    }

    submitting.current = true;
    forPublish ? setPublishing(true) : setSaving(true);

    try {
      const data = new FormData();
      data.append("title", form.title.trim());
      data.append("excerpt", form.excerpt.trim());
      data.append("content", form.content);
      // if (form.blog_type) data.append("blog_type", form.blog_type);
      data.append("status", status);
      console.log("CoverFile:",coverFile)
      if (coverFile) data.append("coverImageKey", coverFile);

      const res = await createBlog(data);
      const created = res?.data?.data;

      if (forPublish) {
        setSuccess("Your blog has been published.");
        if (created?.id) navigate(`/blogs/s/${created.slug}`);
        else navigate("/blogs");
        return;
      }

      setForm((prev) => ({ ...prev, status: "draft" }));
      setSavedAt(Date.now());
      setSuccess("Draft saved.");
    } catch (err) {
      const fieldErrors = getFieldErrors(err);
      if (Object.keys(fieldErrors).length) setErrors(fieldErrors);
      setFormError(getApiErrorMessage(err));
      setMode("edit");
    } finally {
      submitting.current = false;
      setSaving(false);
      setPublishing(false);
    }
  };

  return (
    <main className="min-h-screen bg-base-200/40">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <AddBlogHeader
          saving={saving}
          publishing={publishing}
          savedAt={savedAt}
          onSaveDraft={() => submit("draft")}
          onPublish={() => submit("published")}
        />

        {(formError || success) && (
          <div
            role="status"
            className={`mt-6 flex items-start gap-3 rounded-2xl px-4 py-3 text-sm ${
              formError
                ? "bg-error/10 text-error"
                : "bg-success/10 text-success"
            }`}
          >
            <FontAwesomeIcon
              icon={formError ? faCircleExclamation : faCircleCheck}
              className="mt-0.5"
            />
            <span>{formError || success}</span>
          </div>
        )}

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
                  onClick={() => setMode(tab.key)}
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
              coverUrl={coverUrl}
              author={user?.fullName || user?.username || user?.name}
              // blogType={form.blog_type}
              status={form.status}
            />
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,7fr)_minmax(0,3fr)]">
            <div className="min-w-0">
              <BlogTitleInput
                value={form.title}
                onChange={(v) => setField("title", v)}
                error={errors.title}
              />
              <BlogExcerpt
                value={form.excerpt}
                onChange={(v) => setField("excerpt", v)}
                error={errors.excerpt}
              />
              <BlogContentEditor
                value={form.content}
                onChange={(v) => setField("content", v)}
                error={errors.content}
              />
            </div>

            <aside className="min-w-0">
              <BlogCoverUpload
                file={coverFile}
                previewUrl={coverUrl}
                onSelect={handleCoverSelect}
                onRemove={() => {
                  setCoverFile(null);
                  setSavedAt(null);
                }}
                error={errors.coverImage}
              />
              {/* <BlogSettings
                blogType={form.blog_type}
                status={form.status}
                onBlogTypeChange={(v) => setField("blog_type", v)}
                onStatusChange={(v) => setField("status", v)}
                error={errors.blog_type}
              /> */}
            </aside>
          </div>
        )}
      </div>
    </main>
  );
};

export default AddBlog;