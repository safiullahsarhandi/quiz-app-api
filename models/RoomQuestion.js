const {Schema, Types,model} = require('mongoose');


const RoomQuestionSchema = new Schema({
    roomId : {
        type : Types.ObjectId,
        required : true,
        ref : 'Room',
    },
    question : String,
    questionId : {
        type : Types.ObjectId, 
        default : null,
        ref : 'Question',
    },
    playerId : {
        type : Types.ObjectId, 
        default : null,
        ref : 'Player',
    },
    status : {
        type : String, 
        enum : ['in_progress','done'],
        default : 'in_progress',
    },
},{
    timestamps : true,
    toJSON : {virtuals : true,},
    toObject : {virtuals : true}
});

RoomQuestionSchema.virtual('player',{
    ref : 'Player',
    localField : 'playerId',
    foreignField : '_id',
    justOne : true,
});
module.exports = model('RoomQuestion',RoomQuestionSchema);