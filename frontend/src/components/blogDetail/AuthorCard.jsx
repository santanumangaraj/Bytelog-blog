import React from "react";
import { CYAN, PINK } from "../blog/blogUi.jsx";

const AuthorCard = ({ author }) => {
  if (!author) return null;
  const name = author.fullName || author.username || "Author";
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");

  return (
    <section className="card mt-10 flex-row items-start gap-5 rounded-3xl bg-base-100 p-6 shadow-md sm:p-8">
      {author.avatar ? (
        <img
          src={author.avatar}
          alt={name}
          loading="lazy"
          className="h-16 w-16 shrink-0 rounded-2xl object-cover"
        />
      ) : (
        <div
          className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl font-bold text-white"
          style={{ backgroundImage: `linear-gradient(135deg, ${CYAN}, ${PINK})` }}
          aria-hidden="true"
        >
          {initials || "BL"}
        </div>
      )}
      <div className="min-w-0">
        <h3 className="font-barlow text-lg font-bold break-words text-base-content">
          {name}
        </h3>
        {(author.role || author.headline) && (
          <p className="text-sm font-medium" style={{ color: PINK }}>
            {author.role || author.headline}
          </p>
        )}
        {(author.bio || author.about) && (
          <p className="mt-2 text-sm leading-relaxed text-base-content/70">
            {author.bio || author.about}
          </p>
        )}
      </div>
    </section>
  );
};

export default AuthorCard;