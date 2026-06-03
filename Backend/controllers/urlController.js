import Url from "../models/Url.js";
import { nanoid } from "nanoid";
import validator from "validator";
import Visit from "../models/Visit.js";

const getDateKey = (date) => date.toISOString().slice(0, 10);

const categorizeReferrer = (referrer) => {
  const source = (referrer || "").toLowerCase();

  if (!source || source.includes("localhost") || source.includes("127.0.0.1")) {
    return "Direct";
  }

  if (/facebook|instagram|twitter|t\.co|linkedin|pinterest|reddit|tiktok|snapchat/i.test(source)) {
    return "Social";
  }

  if (/google|bing|yahoo|duckduckgo|baidu|yandex|search/i.test(source)) {
    return "Search";
  }

  return "Referral";
};

const categorizeDevice = (userAgent) => {
  const ua = (userAgent || "").toLowerCase();
  if (/mobile|iphone|android|blackberry|iemobile|opera mini/i.test(ua)) return "Mobile";
  if (/tablet|ipad|playbook|silk/i.test(ua)) return "Tablet";
  return "Desktop";
};

const percentChange = (current, previous) => {
  if (previous === 0) {
    return current === 0 ? 0 : 100;
  }
  return Math.round(((current - previous) / previous) * 100);
};

/* CREATE SHORT URL */
export const createShortUrl = async (req, res) => {
  try {
    console.log(req.body);
    const {
      originalUrl,
      customAlias
    } = req.body;

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

    let shortCode;

    if (
      customAlias &&
      customAlias.trim() !== ""
    ) {

      const existing =
        await Url.findOne({
          shortCode: customAlias,
        });

      if (existing) {
        return res.status(400).json({
          msg: "Alias already taken",
        });
      }

      shortCode = customAlias;

    } else {

      shortCode = nanoid(6);

    }

    const url = await Url.create({
      userId: req.user.id,
      originalUrl,
      shortCode,
    });

    res.status(201).json({
      msg:
        "Short URL created successfully",
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

export const getOverviewAnalytics = async (req, res) => {
  try {
    const urls = await Url.find({
      userId: req.user.id,
    }).sort({ createdAt: -1 });

    const urlIds = urls.map((url) => url._id);
    const visits = await Visit.find({
      urlId: { $in: urlIds },
    }).sort({ createdAt: -1 });

    const urlMap = new Map(urls.map((url) => [url._id.toString(), url]));
    const now = new Date();

    const totalLinks = urls.length;
    const totalClicks = urls.reduce((sum, url) => sum + (url.clicks || 0), 0);
    const activeLinks = urls.filter((url) => !url.expiresAt || new Date(url.expiresAt) > now).length;
    const qrCodesGenerated = urls.filter((url) => !!url.shortCode).length;

    const visitsByDate = {};
    const sourceCounts = { Direct: 0, Social: 0, Search: 0, Referral: 0 };
    const deviceCounts = { Mobile: 0, Desktop: 0, Tablet: 0 };

    visits.forEach((visit) => {
      const dateKey = getDateKey(visit.createdAt);
      visitsByDate[dateKey] = (visitsByDate[dateKey] || 0) + 1;

      const source = categorizeReferrer(visit.referrer);
      sourceCounts[source] = (sourceCounts[source] || 0) + 1;

      const device = categorizeDevice(visit.userAgent);
      deviceCounts[device] = (deviceCounts[device] || 0) + 1;
    });

    const createTrend = (days) => {
      return Array.from({ length: days }, (_, index) => {
        const date = new Date(now);
        date.setDate(now.getDate() - (days - 1 - index));
        const key = getDateKey(date);
        return {
          date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
          value: visitsByDate[key] || 0,
        };
      });
    };

    const nowMs = now.getTime();
    const days7Ago = new Date(nowMs - 7 * 24 * 60 * 60 * 1000);
    const days14Ago = new Date(nowMs - 14 * 24 * 60 * 60 * 1000);

    const linksCreatedLast7 = urls.filter((url) => new Date(url.createdAt) >= days7Ago).length;
    const linksCreatedPrev7 = urls.filter((url) => {
      const date = new Date(url.createdAt);
      return date >= days14Ago && date < days7Ago;
    }).length;

    const visitsLast7 = visits.filter((visit) => new Date(visit.createdAt) >= days7Ago).length;
    const visitsPrev7 = visits.filter((visit) => {
      const date = new Date(visit.createdAt);
      return date >= days14Ago && date < days7Ago;
    }).length;

    const nTopLinks = [...urls]
      .sort((a, b) => (b.clicks || 0) - (a.clicks || 0))
      .slice(0, 5)
      .map((url) => ({
        _id: url._id,
        shortCode: url.shortCode,
        originalUrl: url.originalUrl,
        clicks: url.clicks || 0,
        createdAt: url.createdAt,
      }));

    const recentEvents = [
      ...urls.slice(0, 6).map((url) => ({
        type: "created",
        date: url.createdAt,
        shortCode: url.shortCode,
        originalUrl: url.originalUrl,
      })),
      ...visits.slice(0, 10).map((visit) => ({
        type: "clicked",
        date: visit.createdAt,
        shortCode: urlMap.get(visit.urlId.toString())?.shortCode || "",
        originalUrl: urlMap.get(visit.urlId.toString())?.originalUrl || "",
      })),
    ]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 10);

    res.status(200).json({
      totalLinks,
      totalClicks,
      activeLinks,
      qrCodesGenerated,
      clickTrend7: createTrend(7),
      clickTrend30: createTrend(30),
      trafficSources: Object.entries(sourceCounts).map(([name, value]) => ({ name, value })),
      deviceDistribution: Object.entries(deviceCounts).map(([name, value]) => ({ name, value })),
      topLinks: nTopLinks,
      recentActivity: recentEvents,
      growth: {
        totalLinks: percentChange(linksCreatedLast7, linksCreatedPrev7),
        totalClicks: percentChange(visitsLast7, visitsPrev7),
        activeLinks: activeLinks ? Math.round((activeLinks / (totalLinks || 1)) * 100) : 0,
        qrCodesGenerated: percentChange(linksCreatedLast7, linksCreatedPrev7),
      },
    });
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
