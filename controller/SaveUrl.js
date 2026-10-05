import { URLs } from "../model/url.js";
import { generateShortId } from "../Utils/Keys.js";
import { validateUrl } from "../Utils/validateUrl.js";

export const SaveURL = async (req, res) => {
  const { normalizedUrl, error } = validateUrl(req.body?.longUrl);
  if (error) {
    return res.status(400).json({
      ok: false,
      message: error,
    });
  }

  try {
    const shortId = generateShortId(7);
    const newURL = new URLs({ ShortId: shortId, LongUrl: normalizedUrl });
    await newURL.save();
    const shortURL = `${process.env.BASE_URL}/${shortId}`;
    return res.status(200).json({
      ok: true,
      shortURL: shortURL,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      ok: false,
      message: "Internal Server Error",
    });
  }
};
