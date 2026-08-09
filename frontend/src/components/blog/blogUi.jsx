import React, { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faCalendarDays } from "@fortawesome/free-solid-svg-icons";

/* ---------- brand tokens (same as Home/About/Contact) ---------- */
export const CYAN = "#55DDE0";
export const PINK = "#FF2DAA";

/* ---------- tiny scroll-reveal (same as Home) ---------- */
export const useInView = (options = { threshold: 0.12 }) => {
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

export const Reveal = ({ children, delay = 0, className = "" }) => {
    const [ref, inView] = useInView();
    return (
        <div
            ref={ref}
            style={{ transitionDelay: `${delay}ms` }}
            className={`transition-all duration-700 ease-out ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                } ${className}`}
        >
            {children}
        </div>
    );
};

export const formatDate = (value) =>
    value
        ? new Date(value).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        })
        : "";

export const Meta = ({ author, date, className = "" }) => (
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

export const SectionHeading = ({ label, title, action }) => (
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