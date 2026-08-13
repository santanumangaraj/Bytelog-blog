/* Frontend-only convenience for hiding management controls.
   Authorization itself is enforced by the backend on PATCH/DELETE. */
export const getBlogOwnerId = (blog) =>
  blog?.authorId ??
  blog?.author_id ??
  blog?.userId ??
  blog?.user_id ??
  blog?.owner?.id ??
  blog?.authorDetails?.id ??
  (typeof blog?.author === "object" ? blog?.author?.id : blog?.author);

export const isBlogOwner = (blog, user) => {
  const ownerId = getBlogOwnerId(blog);
  const userId = user?.id ?? user?._id ?? user?.userId;
  if (ownerId == null || userId == null) return false;
  return String(ownerId) === String(userId);
};

/* Statuses supported by the app — mirrors the Add Blog form / backend enum. */
export const BLOG_STATUSES = [
  { value: "draft", label: "Draft" },
  { value: "published", label: "Published" },
  { value: "archived", label: "Archived" },
];

export const isValidStatus = (status) =>
  BLOG_STATUSES.some((s) => s.value === status);