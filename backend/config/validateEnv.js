import "dotenv/config";

// Fail fast at boot if a required secret/config value is missing, instead of
// starting successfully and only surfacing the problem later as a generic
// 500 the first time a route that needs it (e.g. login) gets hit.
const required = [
    "JWT_ACCESS_SECRET",
    "JWT_REFRESH_SECRET",
    "DB_USER",
    "DB_PASS",
    "DB_NAME",
    "DB_HOST",
];

const missing = required.filter((key) => !process.env[key]);

if (missing.length) {
    throw new Error(
        `Missing required environment variables: ${missing.join(", ")}. Check backend/.env against backend/.env.sample.`
    );
}
