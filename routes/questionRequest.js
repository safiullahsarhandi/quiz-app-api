"use strict";

const express = require("express");
const router = express.Router();

const UserAuth = require("../middlewares/UserAuth");
const AdminAuth = require("../middlewares/AdminAuth");

const {
  addQuestion,
  logs,
  details,
  rejectQuestion,
  addToQuestions,
} = require("../controllers/questionRequest");

// @USER ROUTES
router.post("/user/request", UserAuth, addQuestion);

// @ADMIN ROUTES
router.get("/admin/logs", AdminAuth, logs);
router.get("/admin/details/:id", AdminAuth, details);
router.delete("/admin/reject/:id", AdminAuth, rejectQuestion);
router.get("/admin/add/:id", AdminAuth, addToQuestions);

module.exports = router;
