import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import {
  getAllBlogs,
  getBlogBySlug,
  // getBlogLikeCount,
  // toggleBlogLike,
} from "../routes/api.js";
import { CYAN, PINK, Reveal } from "../components/blog/blogUi.jsx";
import renderMarkdown from "../components/addBlog/markdown.jsx";
import ArticleHeader from "../components/blogDetail/ArticleHeader.jsx";
import ArticleActions from "../components/blogDetail/ArticleActions.jsx";
import AuthorCard from "../components/blogDetail/AuthorCard.jsx";
import RelatedBlogs from "../components/blogDetail/RelatedBlogs.jsx";
import BlogDetailSkeleton from "../components/blogDetail/BlogDetailSkeleton.jsx";
import StateCard from "../components/blog/StateCard.jsx";

/* The backend may store markdown-subset text (what the Add Blog editor writes)
   or ready-made HTML. Detect once and render accordingly — no format change. */
const looksLikeHtml = (s = "") => /<\/?(p|h[1-6]|ul|ol|li|pre|img|a|strong|em|blockquote)\b/i.test(s);

const BlogDetails = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [related, setRelated] = useState([]);
  // const [likeCount, setLikeCount] = useState(0);
  // const [liked, setLiked] = useState(false);
  // const [likeBusy, setLikeBusy] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setNotFound(false);
    try {
      const res = await getBlogBySlug(slug);
      const data = res.data?.data ?? res.data;
      const item = data?.rows?.[0] ?? data?.blog ?? data;
      if (!item?.id) throw new Error("not-found");
      setBlog(item);
    } catch {
      setBlog(null);
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    load();
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [load]);

  /* likes — reuse the existing like endpoints */
  // useEffect(() => {
  //   let alive = true;
  //   (async () => {
  //     try {
  //       const res = await getBlogLikeCount(id);
  //       const data = res.data?.data ?? res.data;
  //       if (!alive) return;
  //       setLikeCount(data?.count ?? data?.likeCount ?? data?.likes ?? 0);
  //       setLiked(Boolean(data?.isLiked ?? data?.liked));
  //     } catch {
  //       /* likes are non-critical for reading the article */
  //     }
  //   })();
  //   return () => {
  //     alive = false;
  //   };
  // }, [id]);

  /* related articles from the existing list endpoint */
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await getAllBlogs({ page: 1, limit: 4, sortBy: "createdAt", sortType: "desc" });
        const rows = res.data?.data?.rows ?? [];
        if (!alive) return;
        setRelated(rows.filter((b) => String(b?.slug) !== String(slug)).slice(0, 3));
      } catch {
        setRelated([]);
      }
    })();
    return () => {
      alive = false;
    };
  }, [slug]);

  // const onToggleLike = async () => {
  //   setLikeBusy(true);
  //   const prevLiked = liked;
  //   const prevCount = likeCount;
  //   setLiked(!prevLiked);
  //   setLikeCount(prevCount + (prevLiked ? -1 : 1));
  //   try {
  //     await toggleBlogLike(id);
  //   } catch {
  //     setLiked(prevLiked);
  //     setLikeCount(prevCount);
  //   } finally {
  //     setLikeBusy(false);
  //   }
  // };

  const content = blog?.content ?? blog?.blog_content ?? blog?.blogContent ?? "";
  const body = useMemo(() => {
    if (!content) return null;
    if (looksLikeHtml(content)) {
      return (
        <div
          className="prose prose-lg max-w-none text-base-content/80 prose-headings:font-barlow prose-headings:text-base-content prose-a:text-[#FF2DAA] prose-img:rounded-2xl"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      );
    }
    return <div className="text-base leading-8 sm:text-lg">{renderMarkdown(content)}</div>;
  }, [content]);

  const openBlog = (b) => {
    console.log("Blog id:",b)
    // if (b?.id) navigate(`/blogs/id/${b.id}`);
    if (b?.slug) navigate(`/blogs/s/${b.slug}`);
  };

  return (
    <main className="min-h-screen bg-base-200/40">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        {loading ? (
          <BlogDetailSkeleton />
        ) : notFound || !blog ? (
          <StateCard
            title="Blog Not Found"
            description="The article you're looking for doesn't exist or may have been removed."
            actionLabel="Back to Blogs"
            onAction={() => navigate("/blogs")}
          />
        ) : (
          <>
            <article>
              <Reveal>
                <ArticleHeader blog={blog} />
              </Reveal>

              <Reveal delay={80}>
                <div className="mx-auto mt-10 max-w-4xl">
                  {blog.coverImageUrl ? (
                    <img
                      src={blog.coverImageUrl}
                      alt={blog.title || "Blog cover"}
                      className="aspect-[16/9] w-full rounded-3xl object-cover shadow-md"
                    />
                  ) : (
                    <div
                      className="aspect-[16/9] w-full rounded-3xl shadow-md"
                      style={{ backgroundImage: `linear-gradient(135deg, ${CYAN}, ${PINK})` }}
                      aria-hidden="true"
                    />
                  )}
                </div>
              </Reveal>

              <div className="mx-auto mt-12 max-w-4xl">
                <div className="card rounded-3xl bg-base-100 p-6 shadow-md sm:p-10">
                  {body ?? (
                    <p className="text-base-content/60 italic">
                      This article has no content yet.
                    </p>
                  )}
                </div>

                {/* <ArticleActions
                  liked={liked}
                  likeCount={likeCount}
                  likeBusy={likeBusy}
                  onToggleLike={onToggleLike}
                  title={blog.title}
                /> */}

                <AuthorCard author={blog.authorDetails} />
              </div>
            </article>

            <RelatedBlogs blogs={related} onOpen={openBlog} />

            <div className="mt-14 text-center">
              <button
                type="button"
                onClick={() => navigate("/blogs")}
                className="btn gap-2 rounded-full border-0 px-7 font-semibold text-white shadow-md transition-all hover:scale-[1.02] hover:shadow-xl"
                style={{ backgroundImage: `linear-gradient(135deg, ${CYAN}, ${PINK})` }}
              >
                <FontAwesomeIcon icon={faArrowLeft} className="text-xs" />
                Back to Blogs
              </button>
            </div>
          </>
        )}
      </div>
    </main>
  );
};

export default BlogDetails;