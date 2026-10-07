import jwt from "jsonwebtoken";

const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret || Buffer.byteLength(secret, "utf8") < 32) {
    throw new Error("JWT_SECRET must be configured with at least 32 bytes");
  }
  return secret;
};

export const createAccessToken = (user) =>
  jwt.sign(
    { email: user.email },
    getJwtSecret(),
    {
      algorithm: "HS256",
      subject: user.id,
      expiresIn: process.env.JWT_EXPIRES_IN || "1h",
    },
  );

export { getJwtSecret };
