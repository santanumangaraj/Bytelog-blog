import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faPenNib,
    faHeart,
    faBolt,
    faCloud,
    faLock,
    faMobileScreen,
    faRocket,
    faEye,
    faUserPlus,
    faFeatherPointed,
    faPaperPlane,
    faUsers,
    faArrowRight,
} from "@fortawesome/free-solid-svg-icons";
import { faGithub, faLinkedin } from "@fortawesome/free-brands-svg-icons";
/* ---------- tiny scroll-reveal hook (no deps) ---------- */
const useInView = (options = { threshold: 0.15 }) => {
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
/* ---------- data ---------- */
const features = [
    { icon: faPenNib, title: "Rich Blog Editor", desc: "Create beautiful blogs with images, code blocks, and rich formatting." },
    { icon: faHeart, title: "Like System", desc: "Fast and scalable real-time likes powered by an event-driven queue." },
    { icon: faBolt, title: "Lightning Fast", desc: "Optimized delivery with Redis caching and smart pagination." },
    { icon: faCloud, title: "Cloud Storage", desc: "Images stored securely and delivered globally via AWS S3." },
    { icon: faLock, title: "Secure Authentication", desc: "JWT authentication with httpOnly cookies and refresh flow." },
    { icon: faMobileScreen, title: "Fully Responsive", desc: "Looks beautiful on desktop, tablet, and mobile out of the box." },
];
const steps = [
    { icon: faUserPlus, title: "Create Account", desc: "Sign up in seconds and personalize your profile." },
    { icon: faFeatherPointed, title: "Write Your Story", desc: "Draft in a distraction-free rich editor." },
    { icon: faPaperPlane, title: "Publish Blog", desc: "One click to publish to the world." },
    { icon: faUsers, title: "Readers Engage", desc: "Discover, like, and grow your audience." },
];

const AwsS3Logo = () => (
    <svg viewBox="0 0 24 24" className="w-12 h-12" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2L3 7v10l9 5 9-5V7l-9-5z" fill="#FF9900" />
        <path d="M12 22V12L3 7v10l9 5z" fill="#232F3E" opacity="0.4" />
        <path d="M12 22V12l9-5v10l-9 5z" fill="#232F3E" opacity="0.6" />
        <text x="12" y="15" textAnchor="middle" fill="#fff" fontSize="5" fontWeight="bold" fontFamily="sans-serif">S3</text>
    </svg>
);
const BullMQLogo = () => (
    <svg viewBox="0 0 24 24" className="w-12 h-12" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="3" y="10" width="18" height="10" rx="2" fill="#232F3E" />
        <rect x="5" y="12" width="14" height="2" rx="1" fill="#FF4FA3" />
        <rect x="5" y="16" width="10" height="2" rx="1" fill="#55DDE0" />
        <path d="M7 10V6a5 5 0 0 1 10 0v4" stroke="#232F3E" strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
);
const stack = [
    { name: "React", slug: "react" },
    { name: "Tailwind CSS", slug: "tailwindcss" },
    { name: "DaisyUI", slug: "daisyui" },
    { name: "Node.js", slug: "nodedotjs" },
    { name: "Express.js", slug: "express" },
    { name: "MySQL", slug: "mysql" },
    { name: "Redis", slug: "redis" },
    { name: "BullMQ", custom: BullMQLogo  },
    { name: "AWS S3", custom: AwsS3Logo },
    { name: "JWT", slug: "jsonwebtokens" },
];
const CYAN = "#55DDE0";
const PINK = "#FF4FA3";
/* ---------- page ---------- */
const About = () => {
    return (
        <div className="bg-base-100 text-base-content overflow-hidden">
        {/* =========== HERO =========== */}
        <section className="relative isolate overflow-hidden">
            <div
            className="absolute inset-0 -z-10"
            style={{
                background: `linear-gradient(135deg, ${CYAN}22 0%, transparent 40%, ${PINK}22 100%)`,
            }}
            />
            {/* floating blobs */}
            <div
            className="absolute -top-24 -left-24 w-96 h-96 rounded-full blur-3xl opacity-40 animate-pulse -z-10"
            style={{ background: CYAN }}
            />
            <div
            className="absolute top-40 -right-24 w-[28rem] h-[28rem] rounded-full blur-3xl opacity-30 animate-pulse -z-10"
            style={{ background: PINK, animationDelay: "1.2s" }}
            />
            <div
            className="absolute bottom-0 left-1/3 w-72 h-72 rounded-full blur-3xl opacity-25 animate-pulse -z-10"
            style={{ background: CYAN, animationDelay: "2.4s" }}
            />
            <div className="max-w-5xl mx-auto px-6 py-24 md:py-32 text-center">
            <Reveal>
                <span
                className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase mb-6"
                style={{
                    background: `linear-gradient(90deg, ${CYAN}33, ${PINK}33)`,
                    color: PINK,
                }}
                >
                About ByteLog
                </span>
            </Reveal>
            <Reveal delay={100}>
                <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.05]">
                About{" "}
                <span
                    className="bg-clip-text text-transparent"
                    style={{ backgroundImage: `linear-gradient(90deg, ${CYAN}, ${PINK})` }}
                >
                    ByteLog
                </span>
                </h1>
            </Reveal>
            <Reveal delay={200}>
                <p className="mt-6 text-xl md:text-2xl font-semibold text-base-content/80">
                Write. Share. Learn. Grow.
                </p>
            </Reveal>
            <Reveal delay={300}>
                <p className="mt-4 max-w-2xl mx-auto text-base md:text-lg text-base-content/70 leading-relaxed">
                ByteLog is a modern blogging platform where developers, students, writers, and
                technology enthusiasts can share ideas, publish tutorials, and inspire others through
                meaningful content.
                </p>
            </Reveal>
            <Reveal delay={400}>
                <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                    to="/blogs"
                    className="btn btn-lg rounded-2xl border-0 text-white shadow-lg transition hover:scale-[1.03] hover:shadow-xl"
                    style={{ background: `linear-gradient(90deg, ${PINK}, ${CYAN})` }}
                >
                    Explore Blogs
                    <FontAwesomeIcon icon={faArrowRight} />
                </Link>
                <Link
                    to="/add"
                    className="btn btn-lg btn-outline rounded-2xl transition hover:scale-[1.03]"
                    style={{ borderColor: CYAN, color: CYAN }}
                >
                    Start Writing
                </Link>
                </div>
            </Reveal>
            </div>
        </section>
        {/* =========== OUR STORY =========== */}
        <section className="max-w-6xl mx-auto px-6 py-20 md:py-28">
            <div className="grid md:grid-cols-2 gap-12 items-center">
            <Reveal>
                <div className="relative aspect-square rounded-3xl overflow-hidden shadow-xl bg-base-200">
                {/* decorative illustration (pure SVG, no asset dep) */}
                <svg viewBox="0 0 400 400" className="w-full h-full">
                    <defs>
                    <linearGradient id="g1" x1="0" x2="1" y1="0" y2="1">
                        <stop offset="0%" stopColor={CYAN} />
                        <stop offset="100%" stopColor={PINK} />
                    </linearGradient>
                    </defs>
                    <circle cx="120" cy="120" r="90" fill={CYAN} opacity="0.35" />
                    <circle cx="290" cy="230" r="120" fill={PINK} opacity="0.35" />
                    <rect x="70" y="220" width="180" height="120" rx="16" fill="url(#g1)" opacity="0.9" />
                    <rect x="90" y="245" width="140" height="10" rx="5" fill="#fff" opacity="0.8" />
                    <rect x="90" y="265" width="100" height="8" rx="4" fill="#fff" opacity="0.7" />
                    <rect x="90" y="282" width="120" height="8" rx="4" fill="#fff" opacity="0.7" />
                    <rect x="90" y="299" width="80" height="8" rx="4" fill="#fff" opacity="0.7" />
                    <circle cx="310" cy="110" r="34" fill="#fff" opacity="0.9" />
                    <path
                    d="M295 110 l10 10 l20 -22"
                    stroke={PINK}
                    strokeWidth="5"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    />
                </svg>
                </div>
            </Reveal>
            <Reveal delay={150}>
                <div>
                <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">
                    Our{" "}
                    <span
                    className="bg-clip-text text-transparent"
                    style={{ backgroundImage: `linear-gradient(90deg, ${CYAN}, ${PINK})` }}
                    >
                    Story
                    </span>
                </h2>
                <p className="mt-6 text-base-content/75 leading-relaxed text-lg">
                    ByteLog was created with one simple goal: make technical blogging simple, beautiful,
                    and accessible.
                </p>
                <p className="mt-4 text-base-content/75 leading-relaxed text-lg">
                    Whether you're writing your first tutorial or sharing years of professional
                    experience, ByteLog provides a clean and enjoyable writing experience while helping
                    readers discover valuable knowledge.
                </p>
                </div>
            </Reveal>
            </div>
        </section>
        {/* =========== MISSION & VISION =========== */}
        <section className="max-w-6xl mx-auto px-6 py-16 md:py-24">
            <div className="grid md:grid-cols-2 gap-8">
            {[
                {
                icon: faRocket,
                title: "Mission",
                desc: "Empower creators to publish quality content through a fast, beautiful, and modern blogging platform.",
                color: PINK,
                },
                {
                icon: faEye,
                title: "Vision",
                desc: "Build a community where learning, collaboration, and innovation happen through shared knowledge.",
                color: CYAN,
                },
            ].map((c, i) => (
                <Reveal key={c.title} delay={i * 120}>
                <div className="card bg-base-100 shadow-md rounded-3xl border border-base-200 p-8 h-full transition duration-300 hover:-translate-y-1 hover:shadow-2xl">
                    <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg mb-6"
                    style={{
                        background: `linear-gradient(135deg, ${c.color}, ${
                        c.color === PINK ? CYAN : PINK
                        })`,
                    }}
                    >
                    <FontAwesomeIcon icon={c.icon} />
                    </div>
                    <h3 className="text-3xl font-bold">{c.title}</h3>
                    <p className="mt-3 text-base-content/70 leading-relaxed">{c.desc}</p>
                </div>
                </Reveal>
            ))}
            </div>
        </section>
        {/* =========== WHY CHOOSE =========== */}
        <section className="bg-base-200/50 py-20 md:py-28">
            <div className="max-w-6xl mx-auto px-6">
            <Reveal>
                <div className="text-center max-w-2xl mx-auto">
                <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">
                    Why Choose{" "}
                    <span
                    className="bg-clip-text text-transparent"
                    style={{ backgroundImage: `linear-gradient(90deg, ${CYAN}, ${PINK})` }}
                    >
                    ByteLog
                    </span>
                </h2>
                <p className="mt-4 text-base-content/70">
                    Everything you need to write, publish, and grow — in one thoughtful platform.
                </p>
                </div>
            </Reveal>
            <div className="mt-14 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {features.map((f, i) => (
                <Reveal key={f.title} delay={(i % 3) * 100}>
                    <div className="group card bg-base-100 rounded-3xl shadow-md border border-base-200 p-7 h-full transition duration-300 hover:-translate-y-1 hover:shadow-2xl">
                    <div
                        className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-xl shadow-md mb-5 transition group-hover:scale-110"
                        style={{
                        background:
                            i % 2 === 0
                            ? `linear-gradient(135deg, ${CYAN}, ${PINK})`
                            : `linear-gradient(135deg, ${PINK}, ${CYAN})`,
                        }}
                    >
                        <FontAwesomeIcon icon={f.icon} />
                    </div>
                    <h3 className="text-xl font-bold">{f.title}</h3>
                    <p className="mt-2 text-base-content/70 leading-relaxed">{f.desc}</p>
                    </div>
                </Reveal>
                ))}
            </div>
            </div>
        </section>
        {/* =========== HOW IT WORKS =========== */}
        <section className="max-w-6xl mx-auto px-6 py-20 md:py-28">
            <Reveal>
            <div className="text-center max-w-2xl mx-auto">
                <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">
                How{" "}
                <span
                    className="bg-clip-text text-transparent"
                    style={{ backgroundImage: `linear-gradient(90deg, ${CYAN}, ${PINK})` }}
                >
                    ByteLog
                </span>{" "}
                Works
                </h2>
                <p className="mt-4 text-base-content/70">From signup to your first reader — in four steps.</p>
            </div>
            </Reveal>
            <div className="mt-16 relative">
            {/* progress line */}
            <div
                className="hidden md:block absolute top-8 left-[8%] right-[8%] h-1 rounded-full"
                style={{ background: `linear-gradient(90deg, ${CYAN}, ${PINK})` }}
            />
            <div className="grid md:grid-cols-4 gap-10 md:gap-6 relative">
                {steps.map((s, i) => (
                <Reveal key={s.title} delay={i * 120}>
                    <div className="flex md:flex-col items-center md:text-center gap-4 md:gap-0">
                    <div
                        className="relative z-10 w-16 h-16 rounded-full flex items-center justify-center text-white text-xl shadow-lg shrink-0"
                        style={{
                        background: `linear-gradient(135deg, ${CYAN}, ${PINK})`,
                        }}
                    >
                        <FontAwesomeIcon icon={s.icon} />
                    </div>
                    <div className="md:mt-6">
                        <div
                        className="text-xs font-bold uppercase tracking-wider mb-1"
                        style={{ color: PINK }}
                        >
                        Step {i + 1}
                        </div>
                        <h3 className="text-lg font-bold">{s.title}</h3>
                        <p className="text-sm text-base-content/70 mt-1">{s.desc}</p>
                    </div>
                    </div>
                </Reveal>
                ))}
            </div>
            </div>
        </section>
        {/* =========== TECH STACK =========== */}
        <section className="bg-base-200/50 py-20 md:py-28">
            <div className="max-w-6xl mx-auto px-6">
            <Reveal>
                <div className="text-center max-w-2xl mx-auto">
                <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">
                    Technology{" "}
                    <span
                    className="bg-clip-text text-transparent"
                    style={{ backgroundImage: `linear-gradient(90deg, ${CYAN}, ${PINK})` }}
                    >
                    Stack
                    </span>
                </h2>
                <p className="mt-4 text-base-content/70">Built with modern, production-grade tools.</p>
                </div>
            </Reveal>
            <div className="mt-14 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5">
                {stack.map((t, i) => (
                <Reveal key={t.name} delay={(i % 5) * 80}>
                    <div className="card bg-base-100 rounded-2xl shadow-md border border-base-200 p-6 flex flex-col items-center justify-center gap-3 h-full transition duration-300 hover:-translate-y-1 hover:shadow-xl">
                    {t.custom ? (
                        <t.custom />
                    ) : (
                        <img
                        src={`https://cdn.simpleicons.org/${t.slug}`}
                        alt={t.name}
                        className="w-12 h-12 object-contain"
                        loading="lazy"
                        onError={(e) => {
                            const img = e.currentTarget;
                            img.style.display = "none";
                            const fallback = document.createElement("div");
                            fallback.className = "w-12 h-12 rounded-xl flex items-center justify-center text-white text-xs font-bold";
                            fallback.style.background = `linear-gradient(135deg, ${CYAN}, ${PINK})`;
                            fallback.textContent = t.name.replace(/[^A-Z0-9]/g, "").slice(0, 2) || t.name.slice(0, 2).toUpperCase();
                            img.parentNode?.insertBefore(fallback, img.nextSibling);
                        }}
                        />
                    )}
                    <span className="text-sm font-semibold text-center">{t.name}</span>
                    </div>
                </Reveal>
                ))}
            </div>
            </div>
        </section>
        {/* =========== MEET THE DEVELOPER =========== */}
        <section className="max-w-4xl mx-auto px-6 py-20 md:py-28">
            <Reveal>
            <div className="card bg-base-100 rounded-3xl shadow-xl border border-base-200 p-10 md:p-14 text-center relative overflow-hidden">
                <div
                className="absolute -top-24 -right-24 w-72 h-72 rounded-full blur-3xl opacity-30"
                style={{ background: PINK }}
                />
                <div
                className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full blur-3xl opacity-30"
                style={{ background: CYAN }}
                />
                <div className="relative">
                <div
                    className="w-32 h-32 rounded-full mx-auto flex items-center justify-center text-white text-4xl font-extrabold shadow-2xl ring-4 ring-base-100"
                    style={{
                    background: `linear-gradient(135deg, ${CYAN}, ${PINK})`,
                    }}
                >
                    SM
                </div>
                <h3 className="mt-6 text-3xl md:text-4xl font-extrabold">Santanu Mangaraj</h3>
                <p
                    className="mt-1 font-semibold"
                    style={{ color: PINK }}
                >
                    Full Stack Developer
                </p>
                <p className="mt-5 max-w-2xl mx-auto text-base-content/70 leading-relaxed">
                    ByteLog was built as an industrial-scale blogging platform focused on scalability,
                    performance, cloud storage, caching, and modern backend architecture. The project
                    demonstrates real-world development practices using React, Node.js, MySQL, Redis,
                    BullMQ, AWS S3, and JWT authentication.
                </p>
                <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
                    <a
                    href="https://github.com/santanumangaraj"
                    target="_blank"
                    rel="noreferrer"
                    className="btn rounded-2xl border-0 text-white shadow-md transition hover:scale-[1.03] hover:shadow-xl"
                    style={{ background: "#111" }}
                    >
                    <FontAwesomeIcon icon={faGithub} />
                    GitHub
                    </a>
                    <a
                    href="https://www.linkedin.com/in/santanudev"
                    target="_blank"
                    rel="noreferrer"
                    className="btn rounded-2xl border-0 text-white shadow-md transition hover:scale-[1.03] hover:shadow-xl"
                    style={{ background: "#0A66C2" }}
                    >
                    <FontAwesomeIcon icon={faLinkedin} />
                    LinkedIn
                    </a>
                </div>
                </div>
            </div>
            </Reveal>
        </section>
        </div>
    );
};
export default About;