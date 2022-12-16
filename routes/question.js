"use strict";

const express = require("express");
const router = express.Router();

const AdminAuth = require("../middlewares/AdminAuth");

const {
  create,
  logs,
  deleteQuetsion,
  details,
  update,
} = require("../controllers/question");

// const questionController = require('../controllers/api/questionController'); 
// @ADMIN ROUTES
router.get("/admin/logs", AdminAuth, logs);
router.post("/admin/create", AdminAuth, create);
router.delete("/admin/delete/:id", AdminAuth, deleteQuetsion);
router.get("/admin/details/:id", AdminAuth, details);
router.post("/admin/update", AdminAuth, update);


// @USER ROUTES
// router.get('/user/question',questionController.index);
module.exports = router;
