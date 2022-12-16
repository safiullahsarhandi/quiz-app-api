const GameRule = require("../models/GameRule");

exports.update = async (req, res) => {
  try {
    const { game_rules } = req.body;

    let rule = await GameRule.findOne();
    if (!rule) {
      rule = new GameRule({
        game_rules,
      });
    } else {
      rule.game_rules = game_rules;
    }

    await rule.save();

    await res.status(201).json({
      message: "Game Rules Updated",
    });
  } catch (err) {
    res.status(500).json({
      message: err.toString(),
    });
  }
};

exports.get = async (req, res) => {
  try {
    const rule = await GameRule.findOne();
    await res.status(200).json({
      rule,
    });
  } catch (err) {
    res.status(500).json({
      message: err.toString(),
    });
  }
};
