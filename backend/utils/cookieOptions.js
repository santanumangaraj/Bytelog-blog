const isProd = process.env.NODE_ENV === "production";

// accessToken is read by verifyJWT on /users, /blogs, and /likes routes,
// so it must be sent on every request — keep path at "/".
const accessTokenCookieOptions = () => ({
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "strict" : "lax",
    maxAge: 15 * 60 * 1000, // keep numerically in sync with JWT_ACCESS_EXPIRY
    path: "/",
});

// refreshToken is only ever read by /users/refresh-token and cleared by
// /users/logout — scope it there to reduce exposure on every other request.
const refreshTokenCookieOptions = () => ({
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "strict" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, // keep numerically in sync with JWT_REFRESH_EXPIRY
    path: "/api/v2/users",
});

export {
    accessTokenCookieOptions,
    refreshTokenCookieOptions,
}
