export const validateUrl = (value) => {
  if (value === undefined || value === null) {
    return { error: "Please enter a URL" };
  }

  if (typeof value !== "string") {
    return { error: "Please enter a valid URL" };
  }

  let normalizedUrl = value.trim();

  if (!normalizedUrl) {
    return { error: "Please enter a URL" };
  }

  if (!/^https?:\/\//i.test(normalizedUrl)) {
    normalizedUrl = `https://${normalizedUrl}`;
  }

  if (normalizedUrl.length > 2048) {
    return { error: "URL is too long" };
  }

  try {
    const parsedUrl = new URL(normalizedUrl);
    if (
      !["http:", "https:"].includes(parsedUrl.protocol) ||
      !parsedUrl.hostname.includes(".")
    ) {
      return { error: "Please enter a valid URL" };
    }
  } catch {
    return { error: "Please enter a valid URL" };
  }

  return { normalizedUrl };
};
