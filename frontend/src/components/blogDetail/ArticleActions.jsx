import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as faHeartSolid } from "@fortawesome/free-solid-svg-icons";
import { faHeart as faHeartRegular } from "@fortawesome/free-regular-svg-icons";
import { faLinkedinIn, faXTwitter } from "@fortawesome/free-brands-svg-icons";
import { faLink, faCheck } from "@fortawesome/free-solid-svg-icons";
import { PINK } from "../blog/blogUi.jsx";

const ArticleActions = ({ liked, likeCount, likeBusy, onToggleLike, title }) => {
  const [copied, setCopied] = useState(false);
  const url = typeof window !== "undefined" ? window.location.href : "";

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const share = (href) => window.open(href, "_blank", "noopener,noreferrer");

  return (
    <div className="mt-12 flex flex-col gap-5 rounded-3xl bg-base-100 p-5 shadow-md sm:flex-row sm:items-center sm:justify-between sm:p-6">
      <button
        type="button"
        onClick={onToggleLike}
        disabled={likeBusy}
        aria-pressed={Boolean(liked)}
        className="btn w-full rounded-full border transition-all hover:scale-[1.02] sm:w-auto"
        style={
          liked
            ? { backgroundColor: PINK, borderColor: PINK, color: "#fff" }
            : undefined
        }
      >
        <FontAwesomeIcon icon={liked ? faHeartSolid : faHeartRegular} />
        <span className="font-semibold">{liked ? "Liked" : "Like"}</span>
        <span className="opacity-80">{likeCount ?? 0}</span>
      </button>

      <div className="flex flex-wrap items-center gap-2">
        <span className="mr-1 text-sm text-base-content/60">Share this article</span>
        <button
          type="button"
          aria-label="Share on LinkedIn"
          onClick={() =>
            share(
              `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
            )
          }
          className="btn btn-ghost btn-sm rounded-full transition-all hover:scale-[1.05]"
        >
          <FontAwesomeIcon icon={faLinkedinIn} />
        </button>
        <button
          type="button"
          aria-label="Share on X"
          onClick={() =>
            share(
              `https://x.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title || "")}`,
            )
          }
          className="btn btn-ghost btn-sm rounded-full transition-all hover:scale-[1.05]"
        >
          <FontAwesomeIcon icon={faXTwitter} />
        </button>
        <button
          type="button"
          onClick={copy}
          className="btn btn-ghost btn-sm gap-2 rounded-full transition-all hover:scale-[1.05]"
        >
          <FontAwesomeIcon icon={copied ? faCheck : faLink} />
          {copied ? "Copied" : "Copy Link"}
        </button>
      </div>
    </div>
  );
};

export default ArticleActions;