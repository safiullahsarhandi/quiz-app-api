const moment = require("moment");

const Question = require("../models/Question");
const QuestionRequest = require("../models/QuestionRequest");

exports.addQuestion = async (req, res) => {
  try {
    const { question } = req.body;
    const question_request = new QuestionRequest({
      question,
      user: req.userId,
    });

    await question_request.save();

    await res.status(201).json({
      message: "Question Request Sent",
    });
  } catch (err) {
    res.status(500).json({
      message: err.toString(),
    });
  }
};

exports.logs = async (req, res) => {
  try {
    const searchParam = req.query.searchString
      ? {
          name: { $regex: `${req.query.searchString}`, $options: "i" },
        }
      : {};

    const from = req.query.from ? req.query.from : null;
    const to = req.query.to ? req.query.to : null;
    let dateFilter = {};
    if (from && to)
      dateFilter = {
        createdAt: {
          $gte: moment(new Date(from)).startOf("day"),
          $lte: moment(new Date(to)).endOf("day"),
        },
      };

    const logs = await QuestionRequest.paginate(
      {
        ...dateFilter,
      },
      {
        page: req.query.page,
        limit: req.query.perPage,
        lean: true,
        sort: "-_id",
        populate: {
          path: "user",
          select: "name",
          match: {
            ...searchParam,
          },
        },
        select: "user createdAt",
      }
    );

    logs.docs = logs.docs.filter((doc) => doc.user);

    await res.status(200).json({
      logs,
    });
  } catch (err) {
    res.status(500).json({
      message: err.toString(),
    });
  }
};

exports.details = async (req, res) => {
  try {
    const details = await QuestionRequest.findById(req.params.id).populate(
      "user",
      "name"
    );

    await res.status(200).json({
      details,
    });
  } catch (err) {
    res.status(500).json({
      message: err.toString(),
    });
  }
};

exports.rejectQuestion = async (req, res) => {
  try {
    await QuestionRequest.findByIdAndDelete(req.params.id);

    await res.status(201).json({
      message: "Question Rejected",
    });
  } catch (err) {
    res.status(500).json({
      message: err.toString(),
    });
  }
};

exports.addToQuestions = async (req, res) => {
  const session = await Question.startSession();
  try {
    await session.withTransaction(async () => {
      const opts = { session };

      const question_to_add = await QuestionRequest.findById(req.params.id);

      const question = new Question({
        question: question_to_add.question,
        status: true,
        is_deleted: false,
      });

      await question.save(opts);

      await QuestionRequest.findByIdAndDelete(req.params.id).session(session);

      await session.commitTransaction();
      session.endSession();

      await res.status(201).json({
        message: "Requested Question Added To Questions",
      });
    });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();

    res.status(500).json({
      message: err.toString(),
    });
  }
};
