import React from "react";
import { CYAN, PINK } from "../blog/blogUi.jsx";

export const initialsOf = (name = "", email = "") => {
    const source = (name || "").trim() || (email || "").split("@")[0] || "";
    const parts = source.split(/[\s._-]+/).filter(Boolean);
    if (!parts.length) return "BL";
    return (parts[0][0] + (parts[1]?.[0] ?? "")).toUpperCase();
};

const ProfileHeader = ({ user }) => {
    const fullName = user?.fullName || user?.username || "ByteLog Writer";
    const avatar = user?.avatarImageUrl;

    return (
        <section className="overflow-hidden rounded-3xl bg-base-100 shadow-md">
            <div
                className="h-24 w-full sm:h-28"
                style={{ backgroundImage: `linear-gradient(120deg, ${CYAN}, ${PINK})` }}
            />
            <div className="flex flex-col items-center gap-5 px-6 pb-8 text-center sm:flex-row sm:items-end sm:text-left sm:px-8">
                <div className="-mt-12 shrink-0 sm:-mt-14">
                    {avatar ? (
                        <img
                            src={avatar}
                            alt={fullName}
                            className="h-24 w-24 rounded-2xl border-4 border-base-100 object-cover shadow-lg sm:h-28 sm:w-28"
                        />
                    ) : (
                        <div
                            className="font-barlow grid h-24 w-24 place-items-center rounded-2xl border-4 border-base-100 text-3xl font-bold text-white shadow-lg sm:h-28 sm:w-28"
                            style={{ backgroundImage: `linear-gradient(135deg, ${CYAN}, ${PINK})` }}
                        >
                            {initialsOf(fullName, user?.email)}
                        </div>
                    )}
                </div>
                <div className="min-w-0 flex-1 pt-2 sm:pb-1">
                    <p
                        className="mb-1 text-xs font-semibold tracking-[0.2em] uppercase"
                        style={{ color: PINK }}
                    >
                        Profile
                    </p>
                    <h1 className="font-barlow truncate text-3xl font-bold text-base-content sm:text-4xl">
                        {fullName}
                    </h1>
                    {(user?.headline || user?.role) && (
                        <p className="mt-1 text-sm text-base-content/70">{user.headline || user.role}</p>
                    )}
                    {user?.email && (
                        <p className="mt-1 truncate text-sm text-base-content/60">{user.email}</p>
                    )}
                </div>
            </div>
        </section>
    );
};

export default ProfileHeader;