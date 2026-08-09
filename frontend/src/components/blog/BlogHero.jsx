import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenNib } from "@fortawesome/free-solid-svg-icons";
import { useTheme } from "../../context/ThemeContext.jsx";
import { CYAN, PINK } from "./blogUi.jsx";

/* NOTE: adjust these two import paths if your assets live elsewhere. */
import blogTitleBg from "../../assets/blogTitleBg.jpg";
import blogTitleLightBg from "../../assets/blogTitleLightBg.jpg";

const BlogHero = () => {
    const { theme } = useTheme();
    const bg = theme === "night" ? blogTitleBg : blogTitleLightBg;

    return (
        <section className="relative overflow-hidden rounded-3xl bg-base-100">
            <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${bg})` }}
                aria-hidden="true"
            />
            {/* readability scrim + the same brand wash Home uses */}
            <div className="absolute inset-0 bg-base-100/75" aria-hidden="true" />
            <div
                className="absolute inset-0"
                style={{
                    backgroundImage: `linear-gradient(135deg, ${CYAN}22, transparent 55%, ${PINK}22)`,
                }}
                aria-hidden="true"
            />
            <div
                className="pointer-events-none absolute -top-24 -left-16 h-64 w-64 rounded-full opacity-40 blur-3xl"
                style={{ backgroundColor: CYAN }}
            />
            <div
                className="pointer-events-none absolute -right-10 -bottom-28 h-72 w-72 rounded-full opacity-30 blur-3xl"
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
                    <span
                        className="badge badge-lg border-0 bg-base-100/80 text-[11px] font-semibold tracking-[0.2em] uppercase shadow-sm"
                        style={{ color: PINK }}
                    >
                        ByteLog Library
                    </span>
                    <h1 className="font-barlow mt-6 text-3xl leading-tight font-bold text-base-content sm:text-5xl">
                        Explore{" "}
                        <span
                            className="bg-clip-text text-transparent"
                            style={{ backgroundImage: `linear-gradient(135deg, ${CYAN}, ${PINK})` }}
                        >
                            Blogs
                        </span>
                    </h1>
                    <p className="mx-auto mt-5 max-w-2xl text-sm text-base-content/70 sm:text-base">
                        Discover ideas, tutorials, experiences, and insights from developers
                        around the world.
                    </p>
                    <div className="mt-8 flex justify-center">
                        <Link
                            to="/add"
                            className="btn w-full gap-2 rounded-full border-0 px-7 font-semibold text-white shadow-md transition hover:scale-[1.03] hover:shadow-xl sm:w-auto"
                            style={{ backgroundColor: PINK }}
                        >
                            <FontAwesomeIcon icon={faPenNib} className="text-sm" />
                            Write a Blog
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default BlogHero;