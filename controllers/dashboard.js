const User = require("../models/User");
const Question = require("../models/Question");
const { allUsersGraph } = require("../queries");

exports.getHomeData = async (req, res) => {
  try {
    const [user_count, question_count, user_graph] = await Promise.all([
      User.countDocuments(),
      Question.find({ is_deleted: false }).countDocuments(),
      allUsersGraph(req.query.year),
    ]);

    await res.status(200).json({
      user_count,
      question_count,
      user_graph,
    });
  } catch (err) {
    res.status(500).json({
      message: err.toString(),
    });
  }
};
