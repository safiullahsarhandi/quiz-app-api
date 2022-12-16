const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const gameRulesSchema = new Schema(
  {
    game_rules: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("GameRule", gameRulesSchema);
