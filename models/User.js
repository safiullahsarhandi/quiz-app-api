const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const mongoosePaginate = require("mongoose-paginate-v2");

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    user_image: {
      type: String,
      required: false,
      default : null,
      get : function(image){
        return `${process.env.BASE_URL}:${process.env.PORT}/${image}`;
      }
    },
    status: {
      type: Boolean,
      required: true,
    },
    ratings: {
      type: Number,
      default: 0,
    },
    auth: {
      type: Schema.Types.ObjectId,
      ref: "Auth",
      required: true,
    }
  },
  { timestamps: true, toJSON: { virtuals: true,getters : true }, toObject: { virtuals: true,getters : true  } }
);
userSchema.virtual('setting',{
  ref : 'Setting',
  localField : '_id',
  foreignField : 'userId',
  justOne: true, // default is false
});



userSchema.index({ name: "text" });
userSchema.plugin(mongoosePaginate);



module.exports = mongoose.model("User", userSchema);