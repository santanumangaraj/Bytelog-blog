import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllBlogs } from "../routes/api.js";
import { Reveal, SectionHeading } from "../components/blog/blogUi.jsx";
import BlogHero from "../components/blog/BlogHero.jsx";
import BlogFilters from "../components/blog/BlogFilters.jsx";
import FeaturedBlog from "../components/blog/FeaturedBlog.jsx";
import BlogCard from "../components/blog/BlogCard.jsx";
import BlogSkeleton from "../components/blog/BlogSkeleton.jsx";
import BlogPagination from "../components/blog/BlogPagination.jsx";
import {
    EmptyBlogState,
    BlogErrorState,
} from "../components/blog/StateCard.jsx";

const INITIAL_FORM = {
    page: 1,
    limit: 10,
    query: "",
    sortBy: "createdAt",
    sortType: "desc",
};

const Blogs = () => {
    const navigate = useNavigate();

    const [form, setForm] = useState(INITIAL_FORM);
    const [queryInput, setQueryInput] = useState("");
    const [blogs, setBlogs] = useState({ rows: [], pagination: {} });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    /* debounce the search box into form.query (resets to page 1) */
    useEffect(() => {
        const id = setTimeout(() => {
            setForm((prev) =>
                prev.query === queryInput
                    ? prev
                    : { ...prev, query: queryInput, page: 1 },
            );
        }, 400);
        return () => clearTimeout(id);
    }, [queryInput]);

    const fetchBlogs = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await getAllBlogs(form);
            const data = res.data.data;
            setBlogs({ rows: data?.rows ?? [], pagination: data?.pagination ?? {} });
        } catch (err) {
            setError(err);
            setBlogs({ rows: [], pagination: {} });
        } finally {
            setLoading(false);
        }
    }, [form]);

    useEffect(() => {
        fetchBlogs();
    }, [fetchBlogs]);

    const openBlog = (blog) => {
        // if (blog?.id) navigate(`/blogs/id/${blog.id}`);
        if (blog?.id) navigate(`/blog/${blog.slug}`);
    };

    const handleReset = () => {
        setQueryInput("");
        setForm(INITIAL_FORM);
    };

    const handlePageChange = (page) => {
        setForm((prev) => ({ ...prev, page }));
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const featured = blogs.rows[0];
    const rest = useMemo(() => blogs.rows.slice(1), [blogs.rows]);
    const currentPage = blogs.pagination?.currentPage ?? form.page;
    const totalPages = blogs.pagination?.totalPages ?? 1;

    
    return (
        <main className="min-h-screen bg-base-200/40">
            <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
                <BlogHero />

                <div className="mt-10">
                    <BlogFilters
                        query={queryInput}
                        sortBy={form.sortBy}
                        sortType={form.sortType}
                        onQueryChange={setQueryInput}
                        onSortByChange={(sortBy) =>
                            setForm((p) => ({ ...p, sortBy, page: 1 }))
                        }
                        onSortTypeChange={(sortType) =>
                            setForm((p) => ({ ...p, sortType, page: 1 }))
                        }
                        onReset={handleReset}
                    />
                </div>

                <div className="mt-14">
                    {loading ? (
                        <BlogSkeleton />
                    ) : error ? (
                        <BlogErrorState onRetry={fetchBlogs} />
                    ) : blogs.rows.length === 0 ? (
                        <EmptyBlogState onClear={handleReset} />
                    ) : (
                        <>
                            <section>
                                <SectionHeading label="Editor's pick" title="Featured Story" />
                                <Reveal>
                                    <FeaturedBlog blog={featured} onOpen={openBlog} />
                                </Reveal>
                            </section>

                            {rest.length > 0 && (
                                <section className="mt-16">
                                    <SectionHeading label="Keep reading" title="All Articles" />
                                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                        {rest.map((blog, i) => (
                                            <Reveal key={blog?.id ?? i} delay={i * 80}>
                                                <BlogCard blog={blog} onOpen={openBlog} />
                                            </Reveal>
                                        ))}
                                    </div>
                                </section>
                            )}

                            <BlogPagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={handlePageChange}
                            />
                        </>
                    )}
                </div>
            </div>
        </main>
    );
};

export default Blogs;
