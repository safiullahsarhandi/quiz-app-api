// ROUTES
const auth = require("./auth");
const user = require("./user");
const admin = require("./admin");
const gameRule = require("./gameRule");
const question = require("./question");
const dashboard = require("./dashboard");
const notification = require("./notification");
const questionRequest = require("./questionRequest");
const apiRoutes = require('./api');
const express = require("express");
const router = express.Router();

router.use("/auth", auth);
router.use("/user", user);
router.use("/admin", admin);
router.use("/game-rule", gameRule);
router.use("/question", question);
router.use("/dashboard", dashboard);
router.use("/notification", notification);
router.use("/question-request", questionRequest);

router.use('/user',apiRoutes);
module.exports = router;
