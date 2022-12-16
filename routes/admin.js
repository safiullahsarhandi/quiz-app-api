"use strict";

const express = require("express");
const router = express.Router();

const AdminAuth = require("../middlewares/AdminAuth");

const { me, updateAdmin, updatePassword } = require("../controllers/admin");

// @ADMIN ROUTES
router.get("/", AdminAuth, me);
router.post("/", AdminAuth, updateAdmin);
router.post("/password", AdminAuth, updatePassword);

module.exports = router;
