const express = require("express");
const UserAuth = require("../middlewares/UserAuth");
const router = express.Router();
const {get} = require('../controllers/gameRule');
const questionController = require('../controllers/api/questionController');
const accountController = require('../controllers/api/Account/accountController');
const roomController = require('../controllers/api/Room/roomController');
const rateController = require('../controllers/api/Rate/rateController');
const answerController = require('../controllers/api/Answer/answerController');
const accountValidation = require("../validations/accountValidation");
const changePasswordValidation = require("../validations/changePasswordValidation");
const createRoomValidation = require("../validations/createRoomValidation");
const updateSettingsValidation = require("../validations/updateSettingsValidation");
const createQuestionValidation = require("../validations/createQuestionValidation");
const joinRoomValidation = require("../validations/joinRoomValidation");
const storeAnswerValidation = require("../validations/storeAnswerValidation");
const storeRateValidation = require("../validations/storeRateValidation");


// @USER Routes
router.get('/account',UserAuth,accountController.index);
router.post('/account',[UserAuth,accountValidation],accountController.update);
router.post('/account/change-password',[UserAuth,changePasswordValidation],accountController.changePassword);
router.post('/account/settings',[UserAuth,updateSettingsValidation],accountController.saveSettings);

router.get("/game-rule", get);
router.get('/questions',UserAuth,questionController.index);
router.get('/questions/:id',UserAuth,questionController.show);

router.post('/rooms',[UserAuth,createRoomValidation],roomController.store);
router.get('/rooms',[UserAuth],roomController.index);
router.get('/rooms/:roomId',[UserAuth],roomController.show);
router.post('/rooms/:roomId/check',[UserAuth],roomController.checkRoom);
router.post('/rooms/:roomId/join',[UserAuth,joinRoomValidation],roomController.joinRoom);

// game routes
router.post('/rooms/questions/create',[UserAuth,createQuestionValidation],roomController.storeRoomQuestion);
router.get('/rooms/:roomId/questions/current',[UserAuth],roomController.currentAskedQuestion);
router.post('/answers',[UserAuth,storeAnswerValidation],answerController.store);
router.get('/answers/:questionId',[UserAuth],answerController.answers);
router.post('/rate',[UserAuth,storeRateValidation],rateController.store);
router.get('/ratings/:roomId',[UserAuth],rateController.ratings);




module.exports = router; 