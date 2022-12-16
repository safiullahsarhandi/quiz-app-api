const {Schema,model} = require('mongoose');

const SettingSchema = new Schema({
    userId : {
        type : Schema.Types.ObjectId,
        required : true,
        ref : 'User',
    },
    noOfPlayers : {
        type : Schema.Types.Number,
        required : true,
        default : 3
    },
    timer : {
        type : Schema.Types.Number,
        default : 30,
    },
    rounds : {
        type : Schema.Types.Number,
        default : 3,
    }
});

module.exports = model('Setting',SettingSchema);
