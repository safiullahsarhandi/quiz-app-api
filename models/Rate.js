const {Schema, Types,model} = require('mongoose');

const RateSchema = new Schema({
    questionId : {
        type : Types.ObjectId,
        required : true,
        ref : 'RoomQuestion',
    },
    answerId : {
        type : Types.ObjectId,
        required : true,
        ref : 'Answer',
    },
    rate : {
        type : Number,
        default : 3
    },
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

RateSchema.virtual('player',{
    ref : 'Player',
    localField : 'playerId',
    foreignField : '_id',
    justOne : true,
});

RateSchema.virtual('answer',{
    ref : 'Answer',
    localField : 'answerId',
    foreignField : '_id',
    justOne : true,
});

module.exports = model('Rate',RateSchema);