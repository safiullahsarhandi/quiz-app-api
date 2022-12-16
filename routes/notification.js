"use strict";

const express = require("express");
const router = express.Router();

const AdminAuth = require("../middlewares/AdminAuth");

const {
  getNotificationCount,
  getNotificationAdmin,
  readNotification,
} = require("../controllers/notification");

// @ADMIN ROUTES
router.get("/admin/", AdminAuth, getNotificationAdmin);
router.get("/admin/read/:id", AdminAuth, readNotification);
router.get("/admin/count", AdminAuth, getNotificationCount);

module.exports = router;
