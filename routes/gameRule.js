"use strict";

const express = require("express");
const router = express.Router();

const AdminAuth = require("../middlewares/AdminAuth");

const { update, get } = require("../controllers/gameRule");


// @ADMIN ROUTES
router.get("/admin/", AdminAuth, get);
router.post("/admin/", AdminAuth, update);




module.exports = router;
