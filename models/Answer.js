const {Schema, Types,model} = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const AnswerSchema = new Schema({
    roomQuestionId : {
        type : Types.ObjectId,
        required : true,
        ref : 'RoomQuestion',
    },
    answer : String,
    playerId : {
        type : Types.ObjectId, 
        default : null,
        ref : 'Player',
    }
},{
    timestamps : true,
    toJSON : {virtuals : true,},
    toObject : {virtuals : true}
});
AnswerSchema.plugin(mongoosePaginate);

AnswerSchema.virtual('player',{
    ref : 'Player',
    localField : 'playerId',
    foreignField : '_id',
    justOne : true,
});

AnswerSchema.virtual('question',{
    ref : 'RoomQuestion',
    localField : 'roomQuestionId',
    foreignField : '_id',
    justOne : true,
});

AnswerSchema.virtual('ratings',{
    ref : 'Rate',
    localField : '_id',
    foreignField : 'answerId',
});
module.exports = model('Answer',AnswerSchema);