const Question = require("../models/Question");

exports.create = async (req, res) => {
  try {
    const { question } = req.body;

    const new_question = new Question({
      question,
      status: true,
      is_deleted: false,
    });

    await new_question.save();

    await res.status(201).json({
      message: "Question Added",
    });
  } catch (err) {
    res.status(500).json({
      message: err.toString(),
    });
  }
};

exports.logs = async (req, res) => {
  try {
    const logs = await Question.paginate(
      {
        is_deleted: false,
      },
      {
        page: req.query.page,
        limit: req.query.perPage,
        lean: true,
      }
    );

    await res.status(200).json({
      logs,
    });
  } catch (err) {
    res.status(500).json({
      message: err.toString(),
    });
  }
};

exports.deleteQuetsion = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    question.is_deleted = true;
    await question.save();

    await res.status(201).json({
      message: "Question Deleted",
    });
  } catch (err) {
    res.status(500).json({
      message: err.toString(),
    });
  }
};

exports.details = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);

    await res.status(201).json({
      question,
    });
  } catch (err) {
    res.status(500).json({
      message: err.toString(),
    });
  }
};

exports.update = async (req, res) => {
  try {
    const { id, question } = req.body;
    const question_to_edit = await Question.findById(id);

    question_to_edit.question = question;

    await question_to_edit.save();

    await res.status(201).json({
      message: "Question Updated",
    });
  } catch (err) {
    res.status(500).json({
      message: err.toString(),
    });
  }
};
