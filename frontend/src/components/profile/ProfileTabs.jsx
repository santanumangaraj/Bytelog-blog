import React from "react";
import { PINK } from "../blog/blogUi.jsx";

const TABS = [
    { id: "profile", label: "Profile" },
    { id: "blogs", label: "My Blogs" },
    { id: "security", label: "Security" },
];

const ProfileTabs = ({ active, onChange }) => (
    <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
        <div
            role="tablist"
            className="inline-flex min-w-full gap-1 rounded-full bg-base-100 p-1.5 shadow-sm sm:min-w-0"
        >
            {TABS.map((tab) => {
                const isActive = active === tab.id;
                return (
                    <button
                        key={tab.id}
                        role="tab"
                        type="button"
                        aria-selected={isActive}
                        onClick={() => onChange(tab.id)}
                        className={`btn btn-sm flex-1 rounded-full border-0 px-5 font-semibold whitespace-nowrap transition-all duration-300 sm:flex-none ${isActive
                                ? "text-white shadow-md"
                                : "btn-ghost text-base-content/70"
                            }`}
                        style={isActive ? { backgroundColor: PINK } : undefined}
                    >
                        {tab.label}
                    </button>
                );
            })}
        </div>
    </div>
);

export default ProfileTabs;
