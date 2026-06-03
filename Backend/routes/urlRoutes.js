import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  createShortUrl,
  getUserUrls,
  deleteUrl,
  getAnalytics,
  getOverviewAnalytics,
} from "../controllers/urlController.js";

const router = express.Router();

// Create Short URL
router.post(
  "/create",
  authMiddleware,
  createShortUrl
);

// Get Logged In User URLs
router.get(
  "/",
  authMiddleware,
  getUserUrls
);

router.get(
  "/overview",
  authMiddleware,
  getOverviewAnalytics
);

// Delete URL
router.delete(
  "/:id",
  authMiddleware,
  deleteUrl
);

router.get(
  "/:id/analytics",
  authMiddleware,
  getAnalytics
);

export default router;
