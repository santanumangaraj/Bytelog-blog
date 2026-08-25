import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { forgotPassword } from "../routes/api.js";

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [err, setErr] = useState("");
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErr("");
        setLoading(true);
        try {
            await forgotPassword({ email });
            // Backend always responds the same way whether or not the account
            // exists, so this message is safe to show unconditionally.
            setSent(true);
        } catch (err) {
            setErr(err.response?.data?.message || "Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const loadingIcon = () => <span className="loading loading-bars bg-white loading-lg"></span>;

    return (
        <div className="flex flex-col justify-center items-center">
            <div className="text-center flex flex-col gap-2 my-10">
                <img src="/ByteLog.svg" className="h-16 sm:h-20 md:h-24 mx-auto" alt="bytelog" />
                <h3 className="text-2xl sm:text-3xl font-semibold">Forgot password?</h3>
                <p className="text-sm sm:text-base">
                    Remembered it?{" "}
                    <a onClick={() => navigate("/login")} className="text-cyan-500 cursor-pointer hover:underline">
                        Back to sign in
                    </a>
                </p>
            </div>

            {sent ? (
                <div className="w-full max-w-sm sm:max-w-md px-4">
                    <div role="alert" className="alert alert-success">
                        <span>
                            If an account with that email exists, we've sent a link to reset your password. It expires in 30 minutes.
                        </span>
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
                    <p className="text-sm text-base-content/70">
                        Enter the email on your account and we'll send you a link to reset your password.
                    </p>
                    <label htmlFor="email" className="font-semibold text-base">Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={email}
                        placeholder="Enter your email"
                        onChange={(e) => setEmail(e.target.value)}
                        className="p-2 border-2 border-cyan-500 rounded-sm outline-none"
                        required
                    />

                    <button type="submit" disabled={loading} className="bg-[#f999d3] rounded-sm p-2 mt-6 sm:text-lg hover:bg-[#ee68b8] disabled:opacity-60">
                        {loading ? loadingIcon() : "Send reset link"}
                    </button>
                </form>
            )}
        </div>
    );
};

export default ForgotPassword;
