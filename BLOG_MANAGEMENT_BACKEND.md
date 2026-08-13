# ByteLog — Blog Management (backend contract)

Your Node.js backend isn't part of this workspace, so the frontend was built
against these endpoints. Add them following the existing
route → controller → service → repository → Sequelize architecture.

## Endpoints

```
PATCH  /api/v2/blogs/:blogId   (auth, multipart/form-data)
DELETE /api/v2/blogs/:blogId   (auth)
```

### PATCH body (multipart, only editable fields)

| field          | required | notes                                              |
| -------------- | -------- | -------------------------------------------------- |
| `title`        | yes      | min 5 chars                                        |
| `excerpt`      | yes      |                                                     |
| `blog_content` | yes      |                                                     |
| `blog_type`    | no       | existing enum                                      |
| `status`       | yes      | must be one of the existing values (`draft`/`published`) |
| `coverImage`   | no       | multer file — **omit to keep the existing image**  |

### Ownership (service layer, not the controller)

```js
// blog.service.js
export const updateBlog = async ({ blogId, userId, payload, file }) => {
  const blog = await blogRepository.findById(blogId);
  if (!blog) throw new ApiError(404, "Blog not found");
  if (String(blog.authorId) !== String(userId)) throw new ApiError(403, "Forbidden");

  if (!ALLOWED_STATUSES.includes(payload.status)) throw new ApiError(400, "Invalid status");

  let coverImageUrl = blog.coverImageUrl;
  if (file) {
    coverImageUrl = await uploadCoverImage(file);        // existing pipeline (S3/optimizer)
    if (blog.coverImageUrl) await deleteCoverImage(blog.coverImageUrl); // existing cleanup
  }

  return blogRepository.update(blogId, { ...payload, coverImageUrl }); // UPDATE, never INSERT
};

export const removeBlog = async ({ blogId, userId }) => {
  const blog = await blogRepository.findById(blogId);
  if (!blog) throw new ApiError(404, "Blog not found");           // idempotent double-click
  if (String(blog.authorId) !== String(userId)) throw new ApiError(403, "Forbidden");
  return sequelize.transaction((t) => blogRepository.destroy(blogId, t)); // cascades likes etc.
};
```

`userId` must come from the existing JWT/cookie auth middleware (`req.user.id`).
Never trust an `authorId` from the request body — the frontend never sends one.

### Draft visibility
Keep drafts out of public list/detail responses unless the requester is the author.

## Frontend API layer
`src/routes/api.js` exposes `updateBlog(id, formData)` and `deleteBlog(id)`.
Rename the paths there if your controllers mount elsewhere.