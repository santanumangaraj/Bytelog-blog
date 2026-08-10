import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faEyeSlash,
  faCircleCheck,
  faCircleExclamation,
} from "@fortawesome/free-solid-svg-icons";
import { changePassword } from "../../routes/api.js";
import { getApiErrorMessage, getFieldErrors } from "../addBlog/apiError.js";
import { PINK } from "../blog/blogUi.jsx";

const EMPTY = { currentPassword: "", newPassword: "", confirmPassword: "" };

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

const ChangePasswordCard = () => {
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [success, setSuccess] = useState("");
  const [saving, setSaving] = useState(false);

  const setField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => (prev[key] ? { ...prev, [key]: undefined } : prev));
    setFormError("");
    setSuccess("");
  };

  const validate = () => {
    const next = {};
    if (!form.currentPassword) next.currentPassword = "Enter your current password.";
    if (!form.newPassword) next.newPassword = "Enter a new password.";
    else if (form.newPassword.length < 8)
      next.newPassword = "Password must be at least 8 characters.";
    else if (form.newPassword === form.currentPassword)
      next.newPassword = "New password must be different from the current one.";
    if (!form.confirmPassword) next.confirmPassword = "Confirm your new password.";
    else if (form.confirmPassword !== form.newPassword)
      next.confirmPassword = "Passwords do not match.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (saving) return;
    setFormError("");
    setSuccess("");
    if (!validate()) return;

    setSaving(true);
    try {
      await changePassword({
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
        confirmPassword: form.confirmPassword,
      });
      setForm(EMPTY);
      setErrors({});
      setSuccess("Your password has been updated.");
    } catch (err) {
      const fieldErrors = getFieldErrors(err);
      if (Object.keys(fieldErrors).length) setErrors(fieldErrors);
      setFormError(getApiErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="card h-full rounded-3xl bg-base-100 p-6 shadow-md sm:p-8">
      <h2 className="font-barlow text-2xl font-bold text-base-content">Change Password</h2>
      <p className="mt-1 text-sm text-base-content/60">
        Keep your account secure by regularly updating your password.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
        <PasswordField
          id="current-password"
          label="Current Password"
          autoComplete="current-password"
          value={form.currentPassword}
          onChange={(v) => setField("currentPassword", v)}
          error={errors.currentPassword}
        />
        <PasswordField
          id="new-password"
          label="New Password"
          autoComplete="new-password"
          value={form.newPassword}
          onChange={(v) => setField("newPassword", v)}
          error={errors.newPassword}
        />
        <PasswordField
          id="confirm-password"
          label="Confirm New Password"
          autoComplete="new-password"
          value={form.confirmPassword}
          onChange={(v) => setField("confirmPassword", v)}
          error={errors.confirmPassword}
        />

        {formError && (
          <div className="flex items-start gap-2 rounded-2xl bg-error/10 p-3 text-sm text-error transition-all duration-300">
            <FontAwesomeIcon icon={faCircleExclamation} className="mt-0.5" />
            <span>{formError}</span>
          </div>
        )}
        {success && (
          <div className="flex items-start gap-2 rounded-2xl bg-success/10 p-3 text-sm text-success transition-all duration-300">
            <FontAwesomeIcon icon={faCircleCheck} className="mt-0.5" />
            <span>{success}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={saving}
          className="btn mt-1 w-full rounded-full border-0 font-semibold text-white shadow-md transition hover:scale-[1.02] hover:shadow-xl disabled:opacity-70 sm:w-auto sm:self-start sm:px-8"
          style={{ backgroundColor: PINK }}
        >
          {saving && <span className="loading loading-spinner loading-xs" />}
          {saving ? "Updating..." : "Change Password"}
        </button>
      </form>
    </div>
  );
};

export default ChangePasswordCard;