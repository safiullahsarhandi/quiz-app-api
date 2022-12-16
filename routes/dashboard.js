"use strict";

const express = require("express");
const router = express.Router();

const AdminAuth = require("../middlewares/AdminAuth");

const { getHomeData } = require("../controllers/dashboard");

// @ADMIN ROUTES
router.get("/admin/", AdminAuth, getHomeData);

module.exports = router;
