import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { resetPassword } from "../routes/api.js";
import PasswordField from "../components/common/PasswordField.jsx";

const ResetPassword = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token") || "";

    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [err, setErr] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErr("");

        if (newPassword.length < 8) {
            setErr("Password must be at least 8 characters");
            return;
        }
        if (newPassword !== confirmPassword) {
            setErr("Passwords do not match");
            return;
        }

        setLoading(true);
        try {
            await resetPassword({ token, newPassword });
            setSuccess(true);
            setTimeout(() => navigate("/login", { replace: true }), 2000);
        } catch (err) {
            setErr(err.response?.data?.message || "This reset link is invalid or has expired.");
        } finally {
            setLoading(false);
        }
    };

    const loadingIcon = () => <span className="loading loading-bars bg-white loading-lg"></span>;

    if (!token) {
        return (
            <div className="flex flex-col justify-center items-center">
                <div className="text-center flex flex-col gap-2 my-10">
                    <img src="/ByteLog.svg" className="h-16 sm:h-20 md:h-24 mx-auto" alt="bytelog" />
                    <h3 className="text-2xl sm:text-3xl font-semibold">Invalid link</h3>
                </div>
                <div className="w-full max-w-sm sm:max-w-md px-4">
                    <div role="alert" className="alert alert-warning">
                        <span>
                            This password reset link is missing its token. Please request a new one from{" "}
                            <a onClick={() => navigate("/forgot-password")} className="cursor-pointer underline">
                                the forgot password page
                            </a>
                            .
                        </span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col justify-center items-center">
            <div className="text-center flex flex-col gap-2 my-10">
                <img src="/ByteLog.svg" className="h-16 sm:h-20 md:h-24 mx-auto" alt="bytelog" />
                <h3 className="text-2xl sm:text-3xl font-semibold">Reset your password</h3>
            </div>

            {success ? (
                <div className="w-full max-w-sm sm:max-w-md px-4">
                    <div role="alert" className="alert alert-success">
                        <span>Password reset successfully. Redirecting to sign in…</span>
                    </div>
                </div>
            ) : (
                <form className="w-full max-w-sm sm:max-w-md flex flex-col gap-3 py-4 px-4" onSubmit={handleSubmit}>
                    {err && (
                        <div role="alert" className="flex alert alert-warning">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            <span>Warning: {err}!</span>
                        </div>
                    )}

                    <PasswordField
                        id="newPassword"
                        label="New password"
                        autoComplete="new-password"
                        value={newPassword}
                        onChange={setNewPassword}
                    />
                    <PasswordField
                        id="confirmPassword"
                        label="Confirm new password"
                        autoComplete="new-password"
                        value={confirmPassword}
                        onChange={setConfirmPassword}
                    />

                    <button type="submit" disabled={loading} className="bg-[#f999d3] rounded-sm p-2 mt-6 sm:text-lg hover:bg-[#ee68b8] disabled:opacity-60">
                        {loading ? loadingIcon() : "Reset password"}
                    </button>
                </form>
            )}
        </div>
    );
};

export default ResetPassword;
