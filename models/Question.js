const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const mongoosePaginate = require("mongoose-paginate-v2");

const questionSchema = new Schema(
  {
    question: {
      type: String,
      required: true,
    },
    status: {
      type: Boolean,
      required: true,
    },
    is_deleted: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  { timestamps: true }
);

questionSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Question", questionSchema);
