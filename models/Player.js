const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PlayerSchema  = new Schema({
    roomId : {
        type : Schema.Types.ObjectId,
        ref : 'Room',
        required : true,
    },
    username : {
        type : String,
        required : true,        
    },
    userId : {
        type :  Schema.Types.ObjectId,
        ref : 'User',
        required : true,
    },
    isCreator : {
        type :  Boolean,
        default : false,
    },
    status : {
        type :  String,
        enum : ['pending','joined','left','connection_lost'],
        default : 'pending',
    },
    
},{
    timestamps : true,
});

module.exports = mongoose.model('Player',PlayerSchema);