const isProd = process.env.NODE_ENV === "production";

// accessToken is read by verifyJWT on /users, /blogs, and /likes routes,
// so it must be sent on every request — keep path at "/".
const accessTokenCookieOptions = () => ({
    httpOnly: true,
    secure: isProd,
    // "none" is required in production because the frontend (Vercel) and
    // backend (Render) are on different domains — a genuinely cross-site
    // setup. Browsers refuse to attach "strict"/"lax" cookies to
    // cross-site requests at all, which is what was causing every
    // post-login request to come back 401 (the cookie was set but never
    // actually sent back). "none" requires secure:true, which is already
    // set above — both sides being HTTPS (Vercel + Render) makes this safe.
    sameSite: isProd ? "none" : "lax",
    maxAge: 15 * 60 * 1000, // keep numerically in sync with JWT_ACCESS_EXPIRY
    path: "/",
});

// refreshToken is only ever read by /users/refresh-token and cleared by
// /users/logout — scope it there to reduce exposure on every other request.
const refreshTokenCookieOptions = () => ({
    httpOnly: true,
    secure: isProd,
    // "none" is required in production because the frontend (Vercel) and
    // backend (Render) are on different domains — a genuinely cross-site
    // setup. Browsers refuse to attach "strict"/"lax" cookies to
    // cross-site requests at all, which is what was causing every
    // post-login request to come back 401 (the cookie was set but never
    // actually sent back). "none" requires secure:true, which is already
    // set above — both sides being HTTPS (Vercel + Render) makes this safe.
    sameSite: isProd ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, // keep numerically in sync with JWT_REFRESH_EXPIRY
    path: "/api/v2/users",
});

export {
    accessTokenCookieOptions,
    refreshTokenCookieOptions,
}
