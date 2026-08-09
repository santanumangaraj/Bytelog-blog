import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faNewspaper, faRotateRight } from "@fortawesome/free-solid-svg-icons";
import { CYAN, PINK } from "./blogUi.jsx";

const StateCard = ({ title, description, actionLabel, onAction, icon }) => (
    <div className="card mx-auto max-w-xl rounded-3xl bg-base-100 p-10 text-center shadow-md">
        <div
            className="mx-auto grid h-16 w-16 place-items-center rounded-2xl text-white"
            style={{ backgroundImage: `linear-gradient(135deg, ${CYAN}, ${PINK})` }}
        >
            <FontAwesomeIcon icon={icon || faNewspaper} className="text-xl" />
        </div>
        <h3 className="font-barlow mt-6 text-2xl font-bold text-base-content">{title}</h3>
        <p className="mt-2 text-sm text-base-content/70">{description}</p>
        {actionLabel && onAction && (
            <div className="mt-6">
                <button
                    type="button"
                    onClick={onAction}
                    className="btn rounded-full border-0 px-7 font-semibold text-white shadow-md transition hover:scale-[1.03] hover:shadow-xl"
                    style={{ backgroundColor: PINK }}
                >
                    {actionLabel}
                </button>
            </div>
        )}
    </div>
);

export const EmptyBlogState = ({ onClear }) => (
    <StateCard
        title="No blogs found"
        description="Try adjusting your search or filters."
        actionLabel="Clear Filters"
        onAction={onClear}
    />
);

export const BlogErrorState = ({ onRetry }) => (
    <StateCard
        icon={faRotateRight}
        title="Unable to load blogs"
        description="Something went wrong while fetching articles. Please try again."
        actionLabel="Try Again"
        onAction={onRetry}
    />
);

export default StateCard;