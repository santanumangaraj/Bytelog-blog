## Why Tokens Instead of Sessions

Traditional session-based auth stores session state on the server and gives the client a session ID. That works, but it means every request needs a lookup against shared session storage, which can become a bottleneck at scale.

JSON Web Tokens (JWTs) take a different approach: the server signs a token containing the user's identity, and the client sends that token with every request. The server can verify it without touching a database.

## What's Inside a JWT

A JWT has three parts, separated by dots: `header.payload.signature`.

```
eyJhbGciOiJIUzI1NiJ9.eyJpZCI6MTIzfQ.4rY0...
   header               payload         signature
```

The payload contains claims like the user's ID and an expiry time. The signature proves the token wasn't tampered with — anyone can read a JWT's payload, but only someone with the secret key can produce a valid signature for it.

## Access Tokens vs Refresh Tokens

Using a single long-lived token is risky: if it leaks, it stays valid for a long time. A common pattern uses two tokens instead:

```
Login
   ↓
Server issues:
   - Access Token  (short-lived, e.g. 15 min)
   - Refresh Token (long-lived, e.g. 7 days)
   ↓
Access Token  → sent with every API request
Refresh Token → used only to get a new Access Token
```

When the access token expires, the client uses the refresh token to silently get a new one, without forcing the user to log in again.

## Verifying a Token in Node.js

```
import jwt from "jsonwebtoken";

const verifyJWT = async (req, res, next) => {
    const token =
        req.cookies?.accessToken ||
        req.headers.authorization?.split(" ")[1];

    if (!token) {
        throw new ApiError(401, "Unauthorized request");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    req.user = await findUserByPk(decoded.id);
    next();
};
```

## Important Considerations

- Keep the signing secret out of source control and rotate it periodically
- Store the access token in memory or a short-lived cookie, not `localStorage`, if you want to reduce XSS exposure
- Always set an expiry — a JWT with no expiry is effectively a permanent credential
- Revoking a JWT before it expires is hard by design; refresh-token rotation is the usual workaround
- Never put sensitive data in the payload — it's readable, not encrypted

## Conclusion

JWTs trade a database lookup for cryptographic verification, which scales well but comes with real trade-offs around revocation and token storage. Pairing a short-lived access token with a longer-lived refresh token is a practical middle ground used by most production APIs.
