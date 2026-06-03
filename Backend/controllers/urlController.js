import Url from "../models/Url.js";
import { nanoid } from "nanoid";
import validator from "validator";
import Visit from "../models/Visit.js";


/* CREATE SHORT URL */
export const createShortUrl = async (req, res) => {
  try {
    const { originalUrl } = req.body;

    if (!originalUrl) {
      return res.status(400).json({
        msg: "URL is required",
      });
    }

    if (!validator.isURL(originalUrl)) {
      return res.status(400).json({
        msg: "Invalid URL",
      });
    }

    const shortCode = nanoid(6);

    const url = await Url.create({
      userId: req.user.id,
      originalUrl,
      shortCode,
    });

    res.status(201).json({
      msg: "Short URL created successfully",
      shortCode: url.shortCode,
      originalUrl: url.originalUrl,
    });

  } catch (error) {
    res.status(500).json({
      msg: error.message,
    });
  }
};

/* GET ALL URLS OF LOGGED-IN USER */
export const getUserUrls = async (req, res) => {
  try {
    const urls = await Url.find({
      userId: req.user.id,
    }).sort({ createdAt: -1 });

    res.status(200).json(urls);

  } catch (error) {
    res.status(500).json({
      msg: error.message,
    });
  }
};

/* DELETE URL */
export const deleteUrl = async (req, res) => {
  try {
    const { id } = req.params;

    const url = await Url.findOne({
      _id: id,
      userId: req.user.id,
    });

    if (!url) {
      return res.status(404).json({
        msg: "URL not found",
      });
    }

    await Url.findByIdAndDelete(id);

    res.status(200).json({
      msg: "URL deleted successfully",
    });

  } catch (error) {
    res.status(500).json({
      msg: error.message,
    });
  }
};

export const redirectUrl = async (req, res) => {
  try {
    const { shortCode } = req.params;

    const url = await Url.findOne({
      shortCode,
    });

    if (!url) {
      return res.status(404).json({
        msg: "URL not found",
      });
    }

    // Increment click count
    url.clicks += 1;

    await url.save();

    // Store visit history
    await Visit.create({
      urlId: url._id,
    });

    // Redirect
    res.redirect(url.originalUrl);

  } catch (error) {
    res.status(500).json({
      msg: error.message,
    });
  }
};

export const getAnalytics = async (req, res) => {
  try {

    const { id } = req.params;

    const url = await Url.findOne({
      _id: id,
      userId: req.user.id,
    });

    if (!url) {
      return res.status(404).json({
        msg: "URL not found",
      });
    }

    const visits = await Visit.find({
      urlId: url._id,
    })
    .sort({ createdAt: -1 })
    .limit(10);

    res.status(200).json({
      originalUrl: url.originalUrl,
      shortCode: url.shortCode,
      totalClicks: url.clicks,

      lastVisited:
        visits.length > 0
          ? visits[0].createdAt
          : null,

      recentVisits: visits,
    });

  } catch (error) {
    res.status(500).json({
      msg: error.message,
    });
  }
};