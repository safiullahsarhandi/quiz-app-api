const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const mongoosePaginate = require("mongoose-paginate-v2");

const questionRequestSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    question: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

questionRequestSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("QuestionRequest", questionRequestSchema);
