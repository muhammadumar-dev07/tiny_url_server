import {URLs} from "../model/url.js";

export const RedirectURL = async (req, res) => {
  const { shortId } = req.params;
  if (!/^[A-Za-z0-9_-]{7}$/.test(shortId)) {
    return res.status(404).json({
      ok: false,
      message: "Short link not found",
    });
  }

  try {
    const resUrls = await URLs.find({ ShortId: shortId });
    const element = resUrls[0];
    if (!element) {
      return res.status(404).json({
        ok: false,
        message: "Short link not found",
      });
    }
    return res.redirect(element.LongUrl);
  } catch (err) {
    return res.status(500).json({
      ok: false,
      message: "Internal Server Error",
    });
  }
};
