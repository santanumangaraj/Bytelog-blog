import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faEnvelope,
    faLocationDot,
    faClock,
    faPaperPlane,
    faChevronDown,
    faArrowRight,
    faHouse,
    faGlobe,
    } from "@fortawesome/free-solid-svg-icons";
    import { faGithub, faLinkedin, faXTwitter } from "@fortawesome/free-brands-svg-icons";

    const CYAN = "#55DDE0";
    const PINK = "#FF4FA3";

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

    const GradientText = ({ children }) => (
    <span
        className="bg-clip-text text-transparent"
        style={{ backgroundImage: `linear-gradient(90deg, ${CYAN}, ${PINK})` }}
    >
        {children}
    </span>
    );

    /* ---------- data ---------- */
    const infoCards = [
    {
        icon: faEnvelope,
        title: "Email",
        lines: ["support@bytelog.com"],
        note: "Reach us anytime for questions or support.",
        color: PINK,
    },
    {
        icon: faLocationDot,
        title: "Location",
        lines: ["Bhubaneswar, Odisha, India"],
        note: "Built with passion from India.",
        color: CYAN,
    },
    {
        icon: faClock,
        title: "Availability",
        lines: ["Monday – Friday", "9:00 AM – 6:00 PM"],
        note: "We usually reply within 24 hours.",
        color: PINK,
    },
    ];

    const socials = [
    { icon: faGithub, name: "GitHub", url: "https://github.com/", brand: "#181717" },
    { icon: faLinkedin, name: "LinkedIn", url: "https://linkedin.com/", brand: "#0A66C2" },
    { icon: faXTwitter, name: "Twitter", url: "https://x.com/", brand: "#000000" },
    { icon: faGlobe, name: "Portfolio", url: "#", brand: CYAN },
    ];

    const faqs = [
    {
        q: "How long does it take to receive a reply?",
        a: "Usually within 24 hours on working days.",
    },
    {
        q: "Can I contribute to ByteLog?",
        a: "Yes. We welcome developers and writers to contribute ideas and content.",
    },
    {
        q: "How can I report a bug?",
        a: "Use the contact form above or reach out via email at support@bytelog.com.",
    },
    {
        q: "Can I suggest new features?",
        a: "Absolutely. We appreciate feedback and feature suggestions.",
    },
    ];

    /* ---------- form field ---------- */
    const Field = ({ label, type = "text", name, placeholder, textarea, value, onChange }) => (
    <div className="form-control w-full">
        <label className="label pb-1" htmlFor={name}>
        <span className="label-text font-semibold text-base-content/80">{label}</span>
        </label>
        {textarea ? (
        <textarea
            id={name}
            name={name}
            rows={5}
            required
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="textarea w-full rounded-2xl bg-base-200/60 border border-base-200 px-5 py-4 text-base outline-none transition duration-300 focus:bg-base-100 focus:border-[#55DDE0] focus:ring-4 focus:ring-[#55DDE0]/20 focus:shadow-lg resize-none"
        />
        ) : (
        <input
            id={name}
            name={name}
            type={type}
            required
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="input w-full h-14 rounded-2xl bg-base-200/60 border border-base-200 px-5 text-base outline-none transition duration-300 focus:bg-base-100 focus:border-[#FF4FA3] focus:ring-4 focus:ring-[#FF4FA3]/20 focus:shadow-lg"
        />
        )}
    </div>
    );

    /* ---------- accordion ---------- */
    const FaqItem = ({ q, a, open, onToggle }) => (
    <div
        className={`rounded-3xl border bg-base-100 shadow-md overflow-hidden transition duration-300 hover:shadow-xl ${
        open ? "border-[#FF4FA3]/40" : "border-base-200"
        }`}
    >
        <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 text-left px-6 py-5 md:px-8"
        >
        <span className="text-lg font-semibold">{q}</span>
        <span
            className="w-9 h-9 shrink-0 rounded-full flex items-center justify-center text-white transition-transform duration-300"
            style={{
            background: `linear-gradient(135deg, ${CYAN}, ${PINK})`,
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            }}
        >
            <FontAwesomeIcon icon={faChevronDown} />
        </span>
        </button>
        <div
        className="grid transition-all duration-500 ease-in-out"
        style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
        >
        <div className="overflow-hidden">
            <p className="px-6 md:px-8 pb-6 text-base-content/70 leading-relaxed">{a}</p>
        </div>
        </div>
    </div>
    );

    /* ---------- page ---------- */
    const Contact = () => {
    const [form, setForm] = useState({ fullName: "", email: "", subject: "", message: "" });
    const [sent, setSent] = useState(false);
    const [openFaq, setOpenFaq] = useState(0);

    const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

    const handleSubmit = (e) => {
        e.preventDefault();
        setSent(true);
        setForm({ fullName: "", email: "", subject: "", message: "" });
        setTimeout(() => setSent(false), 4000);
    };

    return (
        <div className="bg-base-100 text-base-content overflow-hidden">
        {/* =========== HERO =========== */}
        <section className="relative isolate overflow-hidden">
            <div
            className="absolute inset-0 -z-10"
            style={{
                background: `linear-gradient(135deg, ${CYAN}22 0%, transparent 45%, ${PINK}22 100%)`,
            }}
            />
            <svg
            className="absolute bottom-0 left-0 w-full -z-10"
            viewBox="0 0 1440 220"
            preserveAspectRatio="none"
            >
            <defs>
                <linearGradient id="cwave" x1="0" x2="1" y1="0" y2="0">
                <stop offset="0%" stopColor={CYAN} stopOpacity="0.35" />
                <stop offset="100%" stopColor={PINK} stopOpacity="0.35" />
                </linearGradient>
            </defs>
            <path
                d="M0,120 C280,220 520,20 760,90 C1000,160 1220,60 1440,110 L1440,220 L0,220 Z"
                fill="url(#cwave)"
            />
            </svg>
            <div
            className="absolute -top-24 -left-24 w-96 h-96 rounded-full blur-3xl opacity-40 animate-pulse -z-10"
            style={{ background: CYAN }}
            />
            <div
            className="absolute top-32 -right-24 w-[28rem] h-[28rem] rounded-full blur-3xl opacity-30 animate-pulse -z-10"
            style={{ background: PINK, animationDelay: "1.2s" }}
            />

            <div className="max-w-5xl mx-auto px-6 py-24 md:py-32 text-center">
            <Reveal>
                <span
                className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase mb-6"
                style={{ background: `linear-gradient(90deg, ${CYAN}33, ${PINK}33)`, color: PINK }}
                >
                Contact ByteLog
                </span>
            </Reveal>
            <Reveal delay={100}>
                <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.05]">
                Get in <GradientText>Touch</GradientText>
                </h1>
            </Reveal>
            <Reveal delay={200}>
                <p className="mt-6 text-xl md:text-2xl font-semibold text-base-content/80">
                We'd love to hear from you.
                </p>
            </Reveal>
            <Reveal delay={300}>
                <p className="mt-4 max-w-2xl mx-auto text-base md:text-lg text-base-content/70 leading-relaxed">
                Whether you have questions, feedback, feature ideas, or just want to say hello, feel
                free to reach out. We're always happy to connect with developers, writers, and the
                ByteLog community.
                </p>
            </Reveal>
            </div>
        </section>

        {/* =========== CONTACT INFORMATION =========== */}
        <section className="max-w-6xl mx-auto px-6 py-16 md:py-24">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {infoCards.map((c, i) => (
                <Reveal key={c.title} delay={i * 120}>
                <div className="card bg-base-100 shadow-md rounded-3xl border border-base-200 p-8 h-full text-center sm:text-left transition duration-300 hover:-translate-y-1 hover:shadow-2xl">
                    <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg mb-6 mx-auto sm:mx-0"
                    style={{
                        background: `linear-gradient(135deg, ${c.color}, ${
                        c.color === PINK ? CYAN : PINK
                        })`,
                    }}
                    >
                    <FontAwesomeIcon icon={c.icon} />
                    </div>
                    <h3 className="text-2xl font-bold">{c.title}</h3>
                    {c.lines.map((l) => (
                    <p key={l} className="mt-2 text-lg font-semibold text-base-content/80">
                        {l}
                    </p>
                    ))}
                    <p className="mt-3 text-base-content/65 leading-relaxed">{c.note}</p>
                </div>
                </Reveal>
            ))}
            </div>
        </section>

        {/* =========== CONTACT FORM =========== */}
        <section className="bg-base-200/50 py-20 md:py-28">
            <div className="max-w-6xl mx-auto px-6">
            <Reveal>
                <div className="text-center max-w-2xl mx-auto">
                <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">
                    Send Us a <GradientText>Message</GradientText>
                </h2>
                <p className="mt-4 text-base-content/70">
                    Fill in the form below and we'll get back to you shortly.
                </p>
                </div>
            </Reveal>

            <Reveal delay={150} className="block mt-12">
                <div className="card bg-base-100 shadow-xl rounded-3xl border border-base-200 p-6 sm:p-10 max-w-3xl mx-auto">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                    <Field
                        label="Full Name"
                        name="fullName"
                        placeholder="Your full name"
                        value={form.fullName}
                        onChange={handleChange}
                    />
                    <Field
                        label="Email Address"
                        name="email"
                        type="email"
                        placeholder="you@example.com"
                        value={form.email}
                        onChange={handleChange}
                    />
                    </div>
                    <Field
                    label="Subject"
                    name="subject"
                    placeholder="What is this about?"
                    value={form.subject}
                    onChange={handleChange}
                    />
                    <Field
                    label="Message"
                    name="message"
                    textarea
                    placeholder="Write your message here..."
                    value={form.message}
                    onChange={handleChange}
                    />

                    <button
                    type="submit"
                    className="btn btn-lg w-full rounded-2xl border-0 text-white shadow-lg transition hover:scale-[1.02] hover:shadow-xl"
                    style={{ background: `linear-gradient(90deg, ${PINK}, ${CYAN})` }}
                    >
                    Send Message
                    <FontAwesomeIcon icon={faPaperPlane} />
                    </button>

                    {sent && (
                    <p
                        className="text-center font-semibold rounded-2xl py-3"
                        style={{ background: `${CYAN}22`, color: PINK }}
                    >
                        Thanks for reaching out! We'll reply within 24 hours.
                    </p>
                    )}
                </form>
                </div>
            </Reveal>
            </div>
        </section>

        {/* =========== CONNECT WITH ME =========== */}
        <section className="max-w-6xl mx-auto px-6 py-20 md:py-28">
            <Reveal>
            <div className="text-center max-w-2xl mx-auto">
                <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">
                Connect With <GradientText>Me</GradientText>
                </h2>
                <p className="mt-4 text-base-content/70">
                Follow along, review the code, or just drop a friendly hello.
                </p>
            </div>
            </Reveal>

            <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {socials.map((s, i) => (
                <Reveal key={s.name} delay={i * 100}>
                <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-4 w-full rounded-3xl bg-base-100 border border-base-200 shadow-md px-6 py-5 transition duration-300 hover:-translate-y-1 hover:shadow-2xl"
                    style={{ borderColor: undefined }}
                >
                    <span
                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl text-white shadow-md transition-transform duration-300 group-hover:scale-110"
                    style={{ background: s.brand }}
                    >
                    <FontAwesomeIcon icon={s.icon} />
                    </span>
                    <span className="font-semibold text-lg">{s.name}</span>
                    <FontAwesomeIcon
                    icon={faArrowRight}
                    className="ml-auto opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0"
                    style={{ color: PINK }}
                    />
                </a>
                </Reveal>
            ))}
            </div>
        </section>

        {/* =========== FAQ =========== */}
        <section className="bg-base-200/50 py-20 md:py-28">
            <div className="max-w-3xl mx-auto px-6">
            <Reveal>
                <div className="text-center">
                <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">
                    Frequently Asked <GradientText>Questions</GradientText>
                </h2>
                <p className="mt-4 text-base-content/70">
                    Quick answers to the things people ask us most.
                </p>
                </div>
            </Reveal>
            <div className="mt-12 space-y-4">
                {faqs.map((f, i) => (
                <Reveal key={f.q} delay={i * 90}>
                    <FaqItem
                    q={f.q}
                    a={f.a}
                    open={openFaq === i}
                    onToggle={() => setOpenFaq(openFaq === i ? -1 : i)}
                    />
                </Reveal>
                ))}
            </div>
            </div>
        </section>

        {/* =========== FINAL CTA =========== */}
        <section className="relative isolate overflow-hidden py-24 md:py-32">
            <div
            className="absolute inset-0 -z-10"
            style={{
                background: `linear-gradient(120deg, ${CYAN}1f 0%, transparent 50%, ${PINK}1f 100%)`,
            }}
            />
            <div
            className="absolute -bottom-24 -left-16 w-80 h-80 rounded-full blur-3xl opacity-35 animate-pulse -z-10"
            style={{ background: PINK }}
            />
            <div
            className="absolute -top-20 right-0 w-96 h-96 rounded-full blur-3xl opacity-30 animate-pulse -z-10"
            style={{ background: CYAN, animationDelay: "1.5s" }}
            />

            <div className="max-w-4xl mx-auto px-6 text-center">
            <Reveal>
                <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight">
                Let's Build Something <GradientText>Amazing Together</GradientText>
                </h2>
            </Reveal>
            <Reveal delay={150}>
                <p className="mt-6 max-w-2xl mx-auto text-base md:text-lg text-base-content/70 leading-relaxed">
                Whether you're a developer, student, or writer, we'd love to hear your ideas and help
                you become part of the ByteLog community.
                </p>
            </Reveal>
            <Reveal delay={250}>
                <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                    to="/blogs"
                    className="btn btn-lg w-full sm:w-auto rounded-2xl border-0 text-white shadow-lg transition hover:scale-[1.03] hover:shadow-xl"
                    style={{ background: `linear-gradient(90deg, ${PINK}, ${CYAN})` }}
                >
                    Explore Blogs
                    <FontAwesomeIcon icon={faArrowRight} />
                </Link>
                <Link
                    to="/"
                    className="btn btn-lg w-full sm:w-auto btn-outline rounded-2xl transition hover:scale-[1.03]"
                    style={{ borderColor: CYAN, color: CYAN }}
                >
                    <FontAwesomeIcon icon={faHouse} />
                    Back to Home
                </Link>
                </div>
            </Reveal>
            </div>
        </section>
        </div>
    );
};

export default Contact;