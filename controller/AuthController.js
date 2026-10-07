import bcrypt from "bcryptjs";
import { Users } from "../model/user.js";
import { createAccessToken, getJwtSecret } from "../Utils/authTokens.js";

const isValidEmail = (email) =>
  typeof email === "string" &&
  email.length <= 254 &&
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const getCredentials = (body) => {
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = body?.password;

  if (!isValidEmail(email)) {
    return { error: "A valid email is required" };
  }
  if (
    typeof password !== "string" ||
    password.length < 8 ||
    Buffer.byteLength(password, "utf8") > 72
  ) {
    return { error: "Password must be at least 8 characters and at most 72 bytes" };
  }
  return { email, password };
};

const toPublicUser = (user) => ({ id: user.id, email: user.email });

export const Register = async (req, res) => {
  const credentials = getCredentials(req.body);
  if (credentials.error) {
    return res.status(400).json({ ok: false, message: credentials.error });
  }
  try {
    getJwtSecret();
  } catch (error) {
    console.error("JWT configuration error:", error);
    return res.status(500).json({
      ok: false,
      message: "Authentication is not configured",
    });
  }

  try {
    const passwordHash = await bcrypt.hash(credentials.password, 12);
    const user = new Users({
      email: credentials.email,
      passwordHash,
    });
    const token = createAccessToken(user);
    await user.save();

    return res.status(201).json({
      ok: true,
      user: toPublicUser(user),
      token,
      tokenType: "Bearer",
      expiresIn: process.env.JWT_EXPIRES_IN || "1h",
    });
  } catch (error) {
    if (error?.code === 11000) {
      const duplicateEmail =
        error.keyPattern?.email === 1 ||
        (typeof error.keyValue?.email === "string" &&
          error.keyValue.email.toLowerCase() === credentials.email);

      if (duplicateEmail) {
        return res.status(409).json({
          ok: false,
          message: "An account with this email already exists",
        });
      }

      console.error("Registration hit an unexpected unique database index:", {
        index: error.index,
        keyPattern: error.keyPattern,
      });
      return res.status(500).json({
        ok: false,
        message: "Unable to create account",
      });
    }
    console.error("Registration failed:", error);
    return res.status(500).json({
      ok: false,
      message: "Unable to create account",
    });
  }
};

export const Login = async (req, res) => {
  const credentials = getCredentials(req.body);
  if (credentials.error) {
    return res.status(400).json({ ok: false, message: credentials.error });
  }
  try {
    getJwtSecret();
  } catch (error) {
    console.error("JWT configuration error:", error);
    return res.status(500).json({
      ok: false,
      message: "Authentication is not configured",
    });
  }

  try {
    const user = await Users.findOne({ email: credentials.email }).select("+passwordHash");
    const passwordMatches =
      user && (await bcrypt.compare(credentials.password, user.passwordHash));

    if (!passwordMatches) {
      return res.status(401).json({
        ok: false,
        message: "Invalid email or password",
      });
    }

    return res.status(200).json({
      ok: true,
      user: toPublicUser(user),
      token: createAccessToken(user),
      tokenType: "Bearer",
      expiresIn: process.env.JWT_EXPIRES_IN || "1h",
    });
  } catch (error) {
    console.error("Login failed:", error);
    return res.status(500).json({
      ok: false,
      message: "Unable to log in",
    });
  }
};

export const CurrentUser = async (req, res) => {
  try {
    const user = await Users.findById(req.auth.userId);
    if (!user) {
      return res.status(401).json({
        ok: false,
        message: "Invalid or expired token",
      });
    }

    return res.status(200).json({
      ok: true,
      user: toPublicUser(user),
    });
  } catch (error) {
    console.error("Current user lookup failed:", error);
    return res.status(500).json({
      ok: false,
      message: "Unable to retrieve user",
    });
  }
};
