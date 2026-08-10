import React, { useCallback, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faPlus,
    faArrowRight,
    faRotateRight,
    faNewspaper,
    faCalendarDays,
    faUser,
} from "@fortawesome/free-solid-svg-icons";
import { getAllBlogs } from "../routes/api.js";

/* ---------- brand tokens (same as About/Contact) ---------- */
const CYAN = "#55DDE0";
const PINK = "#FF2DAA";

/* ---------- tiny scroll-reveal (no deps) ---------- */
const useInView = (options = { threshold: 0.12 }) => {
    const ref = useRef(null);
    const [inView, setInView] = useState(false);
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const io = new IntersectionObserver(([e]) => {
        if (e.isIntersecting) {
            setInView(true);
            io.disconnect();
        }
        }, options);
        io.observe(el);
        return () => io.disconnect();
    }, []);
    return [ref, inView];
};

const Reveal = ({ children, delay = 0, className = "" }) => {
    const [ref, inView] = useInView();
    return (
        <div
        ref={ref}
        style={{ transitionDelay: `${delay}ms` }}
        className={`transition-all duration-700 ease-out ${
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        } ${className}`}
        >
        {children}
        </div>
    );
};

/* ---------- helpers ---------- */
const formatDate = (value) =>
    value
        ? new Date(value).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        })
        : "";

const SectionHeading = ({ label, title, action }) => (
    <div className="mb-8 grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4 sm:flex sm:flex-wrap sm:justify-between">
        <div className="min-w-0">
        {label && (
            <p
            className="mb-2 text-xs font-semibold tracking-[0.2em] uppercase"
            style={{ color: PINK }}
            >
            {label}
            </p>
        )}
        <h2 className="font-barlow text-2xl font-bold text-base-content sm:text-3xl">
            {title}
        </h2>
        </div>
        {action}
    </div>
    );

    const NewBlogButton = ({ onClick, className = "" }) => (
    <button
        type="button"
        onClick={onClick}
        className={`btn border-0 gap-2 rounded-full px-6 font-semibold text-white shadow-md transition hover:scale-[1.03] hover:shadow-xl ${className}`}
        style={{ backgroundImage: `linear-gradient(135deg, ${CYAN}, ${PINK})` }}
    >
        <FontAwesomeIcon icon={faPlus} className="text-sm" />
        New Blog
    </button>
);

const Meta = ({ author, date, className = "" }) => (
    <div
        className={`flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-base-content/60 sm:text-sm ${className}`}
    >
        <span className="inline-flex min-w-0 items-center gap-2">
        <FontAwesomeIcon icon={faUser} className="shrink-0 text-[10px]" />
        <span className="truncate">{author}</span>
        </span>
        <span className="inline-flex items-center gap-2">
        <FontAwesomeIcon icon={faCalendarDays} className="shrink-0 text-[10px]" />
        {date}
        </span>
    </div>
);

/* ---------- hero ---------- */
const HomeHero = ({ onStartWriting }) => (
    <section className="relative overflow-hidden rounded-3xl bg-base-100">
        {/* abstract gradient / wave background */}
        <div
        className="absolute inset-0"
        style={{
            backgroundImage: `linear-gradient(135deg, ${CYAN}22, transparent 55%, ${PINK}22)`,
        }}
        />
        <div
        className="pointer-events-none absolute -top-24 -left-16 h-64 w-64 rounded-full blur-3xl opacity-40"
        style={{ backgroundColor: CYAN }}
        />
        <div
        className="pointer-events-none absolute -bottom-28 -right-10 h-72 w-72 rounded-full blur-3xl opacity-30"
        style={{ backgroundColor: PINK }}
        />
        <svg
        className="pointer-events-none absolute bottom-0 left-0 w-full"
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
        aria-hidden="true"
        >
        <path
            d="M0,64 C240,120 480,0 720,40 C960,80 1200,120 1440,72 L1440,120 L0,120 Z"
            fill="currentColor"
            className="text-base-200/70"
        />
        </svg>

        <div className="relative px-6 py-14 text-center sm:px-10 sm:py-20">
        <div className="mx-auto max-w-3xl animate-[fadeIn_.8s_ease-out]">
            <span className="badge badge-lg border-0 bg-base-100/80 text-[11px] font-semibold tracking-[0.2em] uppercase shadow-sm"
            style={{ color: PINK }}
            >
            Welcome to ByteLog
            </span>
            <h1 className="font-barlow mt-6 text-3xl leading-tight font-bold text-base-content sm:text-5xl">
            Explore Ideas.{" "}
            <span
                className="bg-clip-text text-transparent"
                style={{ backgroundImage: `linear-gradient(135deg, ${CYAN}, ${PINK})` }}
            >
                Share Knowledge.
            </span>{" "}
            Grow Together.
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-sm text-base-content/70 sm:text-base">
            Discover thoughtful articles, practical tutorials, and ideas from
            developers and creators around the world.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
                to="/blogs"
                className="btn w-full border-0 gap-2 rounded-full px-7 font-semibold text-white shadow-md transition hover:scale-[1.03] hover:shadow-xl sm:w-auto"
                style={{ backgroundColor: PINK }}
            >
                Explore Blogs
                <FontAwesomeIcon icon={faArrowRight} className="text-sm" />
            </Link>
            <button
                type="button"
                onClick={onStartWriting}
                className="btn btn-outline w-full rounded-full px-7 font-semibold transition hover:scale-[1.03] sm:w-auto"
                style={{ borderColor: CYAN, color: CYAN }}
            >
                Start Writing
            </button>
            </div>
        </div>
        </div>
    </section>
);

/* ---------- featured blog ---------- */
const FeaturedBlog = ({ blog, onOpen }) => (
    <article
        onClick={() => onOpen(blog)}
        className="group card cursor-pointer overflow-hidden rounded-3xl bg-base-100 shadow-md transition duration-300 hover:-translate-y-1 hover:shadow-xl"
    >
        <div className="grid gap-0 lg:grid-cols-2">
        <div className="relative overflow-hidden lg:h-full">
            <div className="aspect-[16/10] w-full overflow-hidden lg:h-full lg:aspect-auto lg:min-h-[320px]">
            {blog?.coverImageUrl ? (
                <img
                src={blog.coverImageUrl}
                alt={blog?.title || "Blog cover"}
                loading="lazy"
                className="h-full w-full rounded-2xl object-cover transition duration-500 group-hover:scale-105"
                />
            ) : (
                <div
                className="h-full w-full rounded-2xl"
                style={{
                    backgroundImage: `linear-gradient(135deg, ${CYAN}, ${PINK})`,
                }}
                />
            )}
            </div>
            <span
            className="absolute top-4 left-4 rounded-full px-3 py-1 text-[10px] font-bold tracking-[0.16em] text-white uppercase shadow-md"
            style={{ backgroundColor: PINK }}
            >
            Latest Article
            </span>
        </div>

        <div className="flex flex-col justify-center gap-4 p-6 sm:p-8">
            <h3 className="font-barlow line-clamp-2 text-2xl font-semibold text-base-content transition-colors duration-300 group-hover:text-[#FF2DAA] sm:text-3xl">
            {blog?.title}
            </h3>
            <p className="line-clamp-3 text-sm text-base-content/70 sm:text-base">
            {blog?.excerpt}
            </p>
            <Meta
            author={blog?.authorDetails?.fullName}
            date={formatDate(blog?.createdAt)}
            className="mt-2"
            />
        </div>
        </div>
    </article>
);

/* ---------- featured posts list ---------- */
const FeaturedPosts = ({ blogs, onOpen }) => (
    <aside className="card rounded-3xl bg-base-100 p-6 shadow-md">
        <h3 className="font-barlow text-lg font-bold text-base-content">
        Featured Posts
        </h3>
        <div
        className="mt-3 mb-2 h-1 w-16 rounded-full"
        style={{ backgroundImage: `linear-gradient(90deg, ${CYAN}, ${PINK})` }}
        />
        <ul className="divide-y divide-base-200">
        {blogs.map((blog, i) => (
            <li key={blog?.id ?? i}>
            <button
                type="button"
                onClick={() => onOpen(blog)}
                className="group flex w-full items-start gap-4 py-4 text-left transition-transform duration-300 hover:translate-x-1"
            >
                <span className="font-barlow shrink-0 text-lg font-bold text-base-content/25 transition-colors group-hover:text-[#55DDE0]">
                {String(i + 1).padStart(2, "0")}
                </span>
                <span className="min-w-0">
                <span className="font-barlow line-clamp-2 block font-semibold text-base-content transition-colors duration-300 group-hover:text-[#FF2DAA]">
                    {blog?.title}
                </span>
                <Meta
                    author={blog?.authorDetails?.fullName}
                    date={formatDate(blog?.createdAt)}
                    className="mt-1"
                />
                </span>
            </button>
            </li>
        ))}
        </ul>
    </aside>
);

/* ---------- blog card ---------- */
const BlogCard = ({ blog, onOpen }) => (
    <article
        onClick={() => onOpen(blog)}
        className="group card cursor-pointer overflow-hidden rounded-2xl bg-base-100 shadow-md transition duration-300 hover:-translate-y-1.5 hover:shadow-xl"
    >
        <div className="aspect-[16/10] w-full overflow-hidden">
        {blog?.coverImageUrl ? (
            <img
            src={blog.coverImageUrl}
            alt={blog?.title || "Blog cover"}
            loading="lazy"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />
        ) : (
            <div
            className="h-full w-full"
            style={{ backgroundImage: `linear-gradient(135deg, ${CYAN}, ${PINK})` }}
            />
        )}
        </div>
        <div className="flex flex-1 flex-col gap-3 p-5">
        <h3 className="font-barlow line-clamp-2 text-lg font-semibold text-base-content transition-colors duration-300 group-hover:text-[#FF2DAA]">
            {blog?.title}
        </h3>
        <p className="line-clamp-2 text-sm text-base-content/65">{blog?.excerpt}</p>
        <Meta
            author={blog?.authorDetails?.fullName}
            date={formatDate(blog?.createdAt)}
            className="mt-auto pt-2"
        />
        </div>
    </article>
);

/* ---------- skeleton ---------- */
const HomeSkeleton = () => (
    <div className="space-y-14">
        <div className="skeleton h-64 w-full rounded-3xl sm:h-80" />

        <div className="grid gap-8 lg:grid-cols-3">
        <div className="card overflow-hidden rounded-3xl bg-base-100 p-0 shadow-md lg:col-span-2">
            <div className="skeleton h-56 w-full rounded-none sm:h-72" />
            <div className="space-y-3 p-6">
            <div className="skeleton h-7 w-3/4" />
            <div className="skeleton h-4 w-full" />
            <div className="skeleton h-4 w-5/6" />
            <div className="flex gap-4 pt-2">
                <div className="skeleton h-4 w-24" />
                <div className="skeleton h-4 w-20" />
            </div>
            </div>
        </div>
        <div className="card rounded-3xl bg-base-100 p-6 shadow-md">
            <div className="skeleton h-5 w-32" />
            <div className="mt-4 space-y-5">
            {[...Array(5)].map((_, i) => (
                <div key={i} className="flex gap-4">
                <div className="skeleton h-6 w-6 shrink-0 rounded" />
                <div className="w-full space-y-2">
                    <div className="skeleton h-4 w-4/5" />
                    <div className="skeleton h-3 w-2/5" />
                </div>
                </div>
            ))}
            </div>
        </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[...Array(3)].map((_, i) => (
            <div key={i} className="card overflow-hidden rounded-2xl bg-base-100 shadow-md">
            <div className="skeleton h-44 w-full rounded-none" />
            <div className="space-y-3 p-5">
                <div className="skeleton h-5 w-4/5" />
                <div className="skeleton h-3 w-full" />
                <div className="skeleton h-3 w-3/5" />
                <div className="flex gap-3 pt-1">
                <div className="skeleton h-3 w-20" />
                <div className="skeleton h-3 w-16" />
                </div>
            </div>
            </div>
        ))}
        </div>
    </div>
);

/* ---------- empty / error ---------- */
const StateCard = ({ title, description, actionLabel, onAction, to }) => (
    <div className="card mx-auto max-w-xl rounded-3xl bg-base-100 p-10 text-center shadow-md">
        <div
        className="mx-auto grid h-16 w-16 place-items-center rounded-2xl text-white"
        style={{ backgroundImage: `linear-gradient(135deg, ${CYAN}, ${PINK})` }}
        >
        <FontAwesomeIcon icon={onAction ? faRotateRight : faNewspaper} className="text-xl" />
        </div>
        <h3 className="font-barlow mt-6 text-2xl font-bold text-base-content">{title}</h3>
        <p className="mt-2 text-sm text-base-content/70">{description}</p>
        <div className="mt-6">
        {onAction ? (
            <button
            type="button"
            onClick={onAction}
            className="btn border-0 rounded-full px-7 font-semibold text-white shadow-md transition hover:scale-[1.03]"
            style={{ backgroundColor: PINK }}
            >
            {actionLabel}
            </button>
        ) : (
            <Link
            to={to}
            className="btn border-0 rounded-full px-7 font-semibold text-white shadow-md transition hover:scale-[1.03]"
            style={{ backgroundColor: PINK }}
            >
            {actionLabel}
            </Link>
        )}
        </div>
    </div>
);

/* ---------- page ---------- */
const Home = () => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const navigate = useNavigate();
    const featuredBlog = blogs[0];

    const handleFetchingBlogs = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
        const res = await getAllBlogs({
            page: 1,
            limit: 10,
            query: "",
            sortBy: "createdAt",
            sortType: "desc",
        });
        setBlogs(res.data.data.rows);
        } catch (err) {
        console.log("err:", err);
        setError(err);
        } finally {
        setLoading(false);
        }
    }, []);

    useEffect(() => {
        handleFetchingBlogs();
    }, [handleFetchingBlogs]);

    const openBlog = (blog) => {
        if (blog?.id) navigate(`/blogs/s/${blog.slug}`);
    };

    const featuredPosts = blogs.slice(1, 6);
    const recentBlogs = blogs.slice(1);

    return (
        <main className="min-h-screen bg-base-200/40">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
            <HomeHero onStartWriting={() => navigate("/add")} />

            <div className="mt-14">
            {loading ? (
                <HomeSkeleton />
            ) : error ? (
                <StateCard
                title="Unable to load articles"
                description="Something went wrong while fetching the latest blogs."
                actionLabel="Try Again"
                onAction={handleFetchingBlogs}
                />
            ) : blogs.length === 0 ? (
                <StateCard
                title="No articles yet"
                description="There aren't any published articles to explore right now."
                actionLabel="Explore Blogs"
                to="/blogs"
                />
            ) : (
                <>
                <section>
                    <SectionHeading
                    label="Fresh off the press"
                    title="Latest from ByteLog"
                    action={<NewBlogButton onClick={() => navigate("/add")} />}
                    />
                    <div className="grid gap-8 lg:grid-cols-3">
                    <Reveal className="lg:col-span-2">
                        <FeaturedBlog blog={featuredBlog} onOpen={openBlog} />
                    </Reveal>
                    {featuredPosts.length > 0 && (
                        <Reveal delay={120}>
                        <FeaturedPosts blogs={featuredPosts} onOpen={openBlog} />
                        </Reveal>
                    )}
                    </div>
                </section>

                {recentBlogs.length > 0 && (
                    <section className="mt-16">
                    <SectionHeading
                        label="Keep reading"
                        title="More Articles"
                        action={
                        <Link
                            to="/blogs"
                            className="btn btn-ghost gap-2 rounded-full font-semibold"
                            style={{ color: PINK }}
                        >
                            View all
                            <FontAwesomeIcon icon={faArrowRight} className="text-sm" />
                        </Link>
                        }
                    />
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {recentBlogs.map((blog, i) => (
                        <Reveal key={blog?.id ?? i} delay={i * 80}>
                            <BlogCard blog={blog} onOpen={openBlog} />
                        </Reveal>
                        ))}
                    </div>
                    </section>
                )}
                </>
            )}
            </div>
        </div>
        </main>
    );
};

export default Home;