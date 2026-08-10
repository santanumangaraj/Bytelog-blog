import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faEnvelope, faAt, faCalendarDays } from "@fortawesome/free-solid-svg-icons";
import { CYAN, formatDate } from "../blog/blogUi.jsx";

const Row = ({ icon, label, value }) => (
  <div className="flex items-start gap-4 border-b border-base-300/60 py-4 last:border-0 last:pb-0">
    <span
      className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl text-white"
      style={{ backgroundColor: CYAN }}
    >
      <FontAwesomeIcon icon={icon} className="text-xs" />
    </span>
    <div className="min-w-0">
      <p className="text-xs font-semibold tracking-wide text-base-content/50 uppercase">
        {label}
      </p>
      <p className="mt-1 break-words text-base font-medium text-base-content">
        {value || "—"}
      </p>
    </div>
  </div>
);

const ProfileInfoCard = ({ user }) => (
  (console.log(user)),
  <div className="card h-full rounded-3xl bg-base-100 p-6 shadow-md sm:p-8">
    <h2 className="font-barlow text-2xl font-bold text-base-content">Profile Information</h2>
    <p className="mt-1 text-sm text-base-content/60">
      Your ByteLog account details.
    </p>
    <div className="mt-4">
      <Row icon={faUser} label="Full Name" value={user?.fullName || user?.name} />
      <Row icon={faEnvelope} label="Email" value={user?.email} />
      <Row icon={faAt} label="Username" value={user?.username} />
      <Row icon={faCalendarDays} label="Joined" value={formatDate(user?.createdAt)} />
    </div>
  </div>
);

export default ProfileInfoCard;