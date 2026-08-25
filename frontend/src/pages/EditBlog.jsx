import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleExclamation, faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import { getBlogBySlug, updateBlog, deleteBlog, updateBlogStatus, getAllTags } from "../routes/api.js";
import { useAuth } from "../context/AuthContext.jsx";
import BlogForm from "../components/blog/BlogForm.jsx";
import StateCard from "../components/blog/StateCard.jsx";
import { validateCoverFile } from "../components/addBlog/BlogCoverUpload.jsx";
import { getApiErrorMessage, getFieldErrors } from "../components/addBlog/apiError.js";
import EditBlogHeader from "../components/blogManage/EditBlogHeader.jsx";
import EditBlogSkeleton from "../components/blogManage/EditBlogSkeleton.jsx";
import DeleteBlogModal from "../components/blogManage/DeleteBlogModal.jsx";
import { isBlogOwner, isValidStatus } from "../components/blogManage/blogOwnership.js";
import BrandSpinner from "../components/common/BrandSpinner.jsx";
import { CYAN, PINK } from "../components/blog/blogUi.jsx";

const EditBlog = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null); // "not-found" | "forbidden" | "error"
  const [blog, setBlog] = useState(null);

  const [form, setForm] = useState({
    title: "",
    excerpt: "",
    content: "",
  });
  const [initial, setInitial] = useState(null);
  const [tags, setTags] = useState([]);
  const [initialTags, setInitialTags] = useState([]);
  const [availableTags, setAvailableTags] = useState([]);

  /* Status is tracked separately from the content fields on purpose — it's
     saved through a different endpoint (PATCH /:blogId/status) than
     title/excerpt/content (PATCH /:blogId), so it can't share `form`'s
     change-tracking without conflating the two. */
  const [status, setStatus] = useState("draft");
  const [initialStatus, setInitialStatus] = useState(null);

  const [coverFile, setCoverFile] = useState(null);
  const [coverObjectUrl, setCoverObjectUrl] = useState("");
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [success, setSuccess] = useState("");
  const [redirecting, setRedirecting] = useState(false);
  const [mode, setMode] = useState("edit");
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const inFlight = useRef(false);

  const load = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const res = await getBlogBySlug(slug);
      const data = res.data?.data ?? res.data;
      const item = data?.rows?.[0] ?? data?.blog ?? data;
      if (!item?.id) throw Object.assign(new Error("nf"), { response: { status: 404 } });

      const next = {
        title: item.title ?? "",
        excerpt: item.excerpt ?? "",
        content: item.content ?? item.blogContent ?? "",
      };
      const itemStatus = isValidStatus(item.status) ? item.status : "draft";
      const itemTags = Array.isArray(item.tags) ? item.tags.map((t) => t.slug) : [];

      setBlog(item);
      setForm(next);
      setInitial(next);
      setStatus(itemStatus);
      setInitialStatus(itemStatus);
      setTags(itemTags);
      setInitialTags(itemTags);
    } catch (err) {
      const status = err?.response?.status;
      setBlog(null);
      setLoadError(status === 403 ? "forbidden" : status === 404 ? "not-found" : "error");
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    load();
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [load]);

  /* the predefined tag list to pick from — fetched once, best-effort */
  useEffect(() => {
    getAllTags()
      .then((res) => setAvailableTags(res.data?.data ?? []))
      .catch(() => setAvailableTags([]));
  }, []);

  /* object URL lifecycle for a newly picked cover */
  useEffect(() => {
    if (!coverFile) {
      setCoverObjectUrl("");
      return undefined;
    }
    const url = URL.createObjectURL(coverFile);
    setCoverObjectUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [coverFile]);

  const tagsDirty = useMemo(() => {
    if (tags.length !== initialTags.length) return true;
    return tags.some((t, i) => t !== initialTags[i]);
  }, [tags, initialTags]);

  /* Whether title/excerpt/content/cover/tags changed — drives whether the
     content-update endpoint (PATCH /:blogId) needs to be called. */
  const contentDirty = useMemo(() => {
    if (!initial) return false;
    if (coverFile) return true;
    if (tagsDirty) return true;
    return Object.keys(initial).some((k) => initial[k] !== form[k]);
  }, [initial, form, coverFile, tagsDirty]);

  /* Whether status changed — drives whether the status endpoint
     (PATCH /:blogId/status) needs to be called. */
  const statusDirty = initialStatus !== null && status !== initialStatus;

  const isDirty = contentDirty || statusDirty;

  useEffect(() => {
    if (!isDirty) return undefined;
    const handler = (e) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [isDirty]);

  const setField = useCallback((key, value) => {
    if (key === "status") {
      setStatus(value);
      setErrors((prev) => (prev.status ? { ...prev, status: undefined } : prev));
      return;
    }
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => (prev[key] ? { ...prev, [key]: undefined } : prev));
  }, []);

  const owner = blog ? isBlogOwner(blog, user) : true;

  const handleCoverSelect = (file) => {
    const message = validateCoverFile(file);
    if (message) {
      setErrors((prev) => ({ ...prev, coverImage: message }));
      return;
    }
    setErrors((prev) => ({ ...prev, coverImage: undefined }));
    setCoverFile(file);
  };

  const validate = () => {
    const next = {};
    if (!form.title.trim()) next.title = "Title is required.";
    else if (form.title.trim().length < 5)
      next.title = "Title should be at least 5 characters.";
    if (!form.excerpt.trim()) next.excerpt = "Excerpt is required.";
    if (!form.content.trim()) next.content = "Blog content is required.";
    if (!isValidStatus(status)) next.status = "Choose a valid status.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const cancel = () => {
    if (isDirty && !window.confirm("You have unsaved changes. Are you sure you want to leave?"))
      return;
    navigate(`/blog/${blog?.slug}`);
  };

  const save = async () => {
    if (inFlight.current) return;
    setFormError("");
    setSuccess("");
    setRedirecting(false);

    if (!validate()) {
      setFormError("Please fix the highlighted fields.");
      setMode("edit");
      return;
    }

    if (!contentDirty && !statusDirty) {
      setFormError("No changes to save.");
      return;
    }

    inFlight.current = true;
    setSaving(true);
    try {
      /* Two independent endpoints — only call the ones whose data actually
         changed, so e.g. publishing a draft doesn't also re-send unchanged
         content, and editing content doesn't also re-send an unchanged status. */
      if (contentDirty) {
        const data = new FormData();
        data.append("title", form.title.trim());
        data.append("excerpt", form.excerpt.trim());
        data.append("content", form.content);
        if (tagsDirty) data.append("tags", JSON.stringify(tags));
        /* cover image is optional on edit — omitting it keeps the existing one */
        if (coverFile) data.append("coverImage", coverFile);
        await updateBlog(blog?.id, data);
      }

      if (statusDirty) {
        await updateBlogStatus(blog?.id, { status });
      }

      setInitial({ ...form });
      setInitialStatus(status);
      setInitialTags(tags);
      setCoverFile(null);
      setSuccess("Blog updated successfully.");
      setRedirecting(true);
      /* Give the success message a moment on screen before navigating away —
         matches the same delayed-redirect pattern used on Login/Register,
         instead of instantly replacing the page before it can be seen. */
      setTimeout(() => {
        navigate(`/blog/${slug}`, { replace: true, state: { flash: "Blog updated successfully." } });
      }, 2000);
    } catch (err) {
      const status = err?.response?.status;
      if (status === 401) {
        navigate("/login", { replace: true, state: { from: `/blog/${blog.slug}/edit` } });
        return;
      }
      if (status === 403) {
        setLoadError("forbidden");
        return;
      }
      const fieldErrors = getFieldErrors(err);
      if (Object.keys(fieldErrors).length) setErrors(fieldErrors);
      setFormError(getApiErrorMessage(err));
      setMode("edit");
    } finally {
      inFlight.current = false;
      setSaving(false);
    }
  };

  const confirmDeleteBlog = async () => {
    if (deleting) return;
    setDeleting(true);
    setDeleteError("");
    try {
      await deleteBlog(blog?.id);
      navigate("/profile", { replace: true, state: { flash: "Blog deleted successfully." } });
    } catch (err) {
      if (err?.response?.status === 401) {
        navigate("/login", { replace: true });
        return;
      }
      setDeleteError(getApiErrorMessage(err));
    } finally {
      setDeleting(false);
    }
  };

  return (
    <main className="min-h-screen bg-base-200/40">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        {loading ? (
          <EditBlogSkeleton />
        ) : loadError === "not-found" ? (
          <StateCard
            title="Blog Not Found"
            description="The article you're looking for doesn't exist or may have been removed."
            actionLabel="Back to Blogs"
            onAction={() => navigate("/blogs")}
          />
        ) : loadError === "forbidden" || !owner ? (
          <StateCard
            title="Permission required"
            description="You don't have permission to edit this blog."
            actionLabel="Back to Blog"
            onAction={() => navigate(`/blog/${blog.slug}`)}
          />
        ) : loadError ? (
          <StateCard
            title="Something went wrong"
            description="Please try again."
            actionLabel="Try Again"
            onAction={load}
          />
        ) : (
          <>
            <EditBlogHeader saving={saving} onCancel={cancel} onSave={save} />

            {redirecting ? (
              <div
                role="status"
                className="mt-6 flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-base-content"
                style={{
                  backgroundImage: `linear-gradient(135deg, ${CYAN}1F, ${PINK}1F)`,
                }}
              >
                <BrandSpinner size={18} />
                <span>{success} Redirecting to your blog…</span>
              </div>
            ) : (
              (formError || success) && (
                <div
                  role="status"
                  className={`mt-6 flex items-start gap-3 rounded-2xl px-4 py-3 text-sm ${
                    formError ? "bg-error/10 text-error" : "bg-success/10 text-success"
                  }`}
                >
                  <FontAwesomeIcon
                    icon={formError ? faCircleExclamation : faCircleCheck}
                    className="mt-0.5"
                  />
                  <span>{formError || success}</span>
                </div>
              )
            )}

            <BlogForm
              form={form}
              status={status}
              errors={errors}
              mode={mode}
              onModeChange={setMode}
              onFieldChange={setField}
              coverFile={coverFile}
              coverPreviewUrl={coverObjectUrl || blog?.coverImageUrl || ""}
              onCoverSelect={handleCoverSelect}
              onCoverRemove={() => setCoverFile(null)}
              author={user?.fullName || user?.username}
              tags={tags}
              onTagsChange={setTags}
              availableTags={availableTags}
            />

            <div className="mt-10 flex flex-col gap-3 rounded-3xl bg-base-100 p-5 shadow-md sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="font-barlow text-base font-bold text-base-content">
                  Delete this blog
                </h3>
                <p className="text-sm text-base-content/60">
                  Permanently removes the article. This cannot be undone.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setConfirmDelete(true)}
                className="btn btn-outline btn-error rounded-full px-6 font-semibold"
              >
                Delete Blog
              </button>
            </div>

            <DeleteBlogModal
              open={confirmDelete}
              title={form.title}
              deleting={deleting}
              error={deleteError}
              onCancel={() => setConfirmDelete(false)}
              onConfirm={confirmDeleteBlog}
            />
          </>
        )}
      </div>
    </main>
  );
};

export default EditBlog;
