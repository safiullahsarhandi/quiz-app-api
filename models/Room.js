const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');
const RoomSchema  = new Schema({
    creatorId : {
        type : Schema.Types.ObjectId,
        ref : 'User',
        required : true,
    },
    username : {
        type : String,
        required : true,
    },
    roomId : {
        type : String,
        required : true,
    },
    roomType : {
        type : String,
        enum : ['public','private'],
        default : 'public',
    },
    status : {
        type : String,
        enum : ['pending','active','inactive'],
        default : 'pending',
    },
    setting : {
        type : Object,
        noOfPlayers : {
            type : String,
            required : true,
        },
        rounds : {
            type : Number,
            required : true,
        },
        timer : {
            type : Number,
            required : true,
        },
    },
 
},{
    timestamps : true,
    toJSON: {
        virtuals: true,
    },
});
RoomSchema.plugin(mongoosePaginate);
const playerRelation = {   
    ref: 'Player', // the collection/model name
    localField: '_id',
    foreignField: 'roomId',
};
const questionRelation = {
    ref : 'RoomQuestion',
    localField : '_id',
    foreignField : 'roomId',
}
RoomSchema.virtual('creator', {   
    ref: 'User', // the collection/model name
    localField: 'creatorId',
    foreignField: '_id',
    justOne: true, // default is false
});
RoomSchema.virtual('players', playerRelation);

RoomSchema.virtual('players_count', {...playerRelation, count  : true});

RoomSchema.virtual('is_joined',{...playerRelation, count  : true} );

RoomSchema.virtual('questions',questionRelation);
RoomSchema.virtual('questions_count',{...questionRelation,count : true});

module.exports = mongoose.model('Room',RoomSchema);