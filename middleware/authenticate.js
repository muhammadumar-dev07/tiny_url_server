import jwt from "jsonwebtoken";
import { getJwtSecret } from "../Utils/authTokens.js";

export const authenticate = (req, res, next) => {
  const authorization = req.get("authorization");
  const parts = authorization?.split(" ") ?? [];
  const [scheme, token] = parts;

  if (parts.length !== 2 || scheme !== "Bearer" || !token) {
    return res.status(401).json({
      ok: false,
      message: "A valid Bearer token is required",
    });
  }

  let secret;
  try {
    secret = getJwtSecret();
  } catch (error) {
    console.error("JWT configuration error:", error);
    return res.status(500).json({
      ok: false,
      message: "Authentication is not configured",
    });
  }

  try {
    const payload = jwt.verify(token, secret, { algorithms: ["HS256"] });
    if (typeof payload === "string" || !payload.sub || !payload.email) {
      return res.status(401).json({
        ok: false,
        message: "Invalid or expired token",
      });
    }
    req.auth = { userId: payload.sub, email: payload.email };
    return next();
  } catch (error) {
    if (!(error instanceof jwt.JsonWebTokenError || error instanceof jwt.TokenExpiredError)) {
      console.error("JWT verification failed:", error);
      return res.status(500).json({
        ok: false,
        message: "Authentication failed",
      });
    }
    return res.status(401).json({
      ok: false,
      message: "Invalid or expired token",
    });
  }
};
