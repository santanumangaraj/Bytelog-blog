import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

const PasswordField = ({ id, label, value, onChange, error, autoComplete }) => {
  const [show, setShow] = useState(false);
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-base-content">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={show ? "text" : "password"}
          value={value}
          autoComplete={autoComplete}
          onChange={(e) => onChange(e.target.value)}
          className={`input input-bordered w-full rounded-2xl bg-base-200/50 pr-12 focus:outline-none ${
            error ? "input-error" : ""
          }`}
          placeholder="••••••••"
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          aria-label={show ? "Hide password" : "Show password"}
          className="btn btn-ghost btn-xs absolute top-1/2 right-2 -translate-y-1/2 rounded-full"
        >
          <FontAwesomeIcon icon={show ? faEyeSlash : faEye} />
        </button>
      </div>
      {error && <p className="mt-1.5 text-xs font-medium text-error">{error}</p>}
    </div>
  );
};

export default PasswordField;
