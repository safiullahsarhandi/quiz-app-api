const { Types } = require("mongoose");
const { mt_rand, shuffle } = require("../../../helpers");
const Player = require("../../../models/Player");
const Room = require("../../../models/Room");
const RoomQuestion = require("../../../models/RoomQuestion");
const Setting = require("../../../models/Setting");
const User = require("../../../models/User");

exports.store = async (req,res)=> {
    
    let roomId = shuffle(mt_rand(1111,999999));
    let isExist = await  Room.aggregate([
        {
            "$match" : {
                creatorId : Types.ObjectId(req.userId),
                status : "pending"
            }, 
        },  
        {
            $lookup : {
                from : 'Player',
                localField : '_id',
                foreignField : 'roomId',
                as : "players"        
            },
        },
        { $group: { _id: null, count: { $sum: 1 } } },
    ]);
        
        if(isExist.length > 0)
    {
        return res.status(201).json({message : 'you cant create or join new room as you already have one room', status : true});
    
    }
    
    let creatorSetting = await Setting.findOne({
        userId : Types.ObjectId(req.userId),
    });
    // store room logs
    let room = new Room({
        creatorId : req.userId,
        roomId,
        roomType : req.body.roomType,
        setting : {
            noOfPlayers : creatorSetting.noOfPlayers,
            rounds : creatorSetting.rounds,
            timer : creatorSetting.timer,
        },
    });
    // store host in players model
    let player = new Player({
        userId : req.userId,
        username : req.body.username,
        roomId : room._id,
        isCreator : true,
        status : 'joined',
    });

    await room.save();
    await player.save();
    
    
    res.status(201).json({message : 'room created successfully', status : true});
    
}

exports.index = async (req,res)=> {
    try {
        let rooms = await Room.paginate({
            roomType : 'public',
        },{
            page : req.query.page,
            limit : req.query.perPage || 10,
            populate: [
                'creator',
                'players',                
        ],
        });
        res.json({message : 'public rooms listing', rooms});
    } catch (error) {
        console.log(error);
    }
}

exports.show = async (req,res)=> {
    let room = await Room.findOne({roomId : req.params.roomId});

    if(!room)
        return res.status(409).json({message : 'invalid room',status : false});
    
    return res.json({message : 'room detail', room});
}

exports.checkRoom = async (req,res) => {
    let room = await Room.findOne({
        roomId : req.params.roomId
    });
    console.log(room);
    let alreadyJoined = await Player.exists({
        roomId : room._id,
        userId : req.userId,        
    });
    if(alreadyJoined)
        res.status(409).json({message : 'you have already joined this room',status : false});

    let playerCount = await Player.count({
        roomId : room._id
    });

    res.json({message : 'room is available',room,status : true});

}

exports.joinRoom = async (req,res) => {
    try{
        let room = await Room.findById(req.params.roomId).populate([{
            path : 'creator',
            populate : {
                path :'setting',
                model : 'Setting',
        }
        },'players_count',{
            path : 'is_joined',
            match : {
                userId : req.userId,                
            }
        }]).lean();
        
        if(room.is_joined){
            return res.status(409).json({message : 'you\'ve already joined this room.',status : false});            
        }
        if(room.players_count >= room.creator.setting.noOfPlayers)
                return res.status(409).json({message : 'you are no more allowed to access this room.',status : false});
            
        let player = new Player({
            userId : req.userId,
            username : req.body.username,
            roomId : room._id,
            isCreator : false,
            status : 'joined',
        });
        await player.save();
        
        res.status(201).json({message : 'room has been joined',status : true});
    }catch(e){
        console.log(e);
        res.status(404).json({status : false,message : 'unable to join this room'});
    }
        
}


exports.storeRoomQuestion = async (req,res)=> {
    let room;
    try {
        room = await Room.findById(req.body.roomId);
    } catch (error) {
        res.status(404).send({message : 'invalid room', status : false});        
    }
    // fetch player
    let player = await Player.findOne()
    .where('roomId').eq(req.body.roomId)
    .where('userId').eq(req.userId)
    .exec();
    
    if(!player)
        res.status(409).json({message : 'please join the room first in order to submit question',status : false});
        
        let inProgressCount = await RoomQuestion.count().where('roomId').eq(room._id).where('status').eq('in_progress').exec();
        if(inProgressCount > 0 )
            res.status(409).json({message : 'you can not submit question at this stage',status : false});

        let question = new RoomQuestion({
            roomId : room._id,
            playerId : player._id,
            question : req.body.question,
            questionId : req.body.questionId || null,
        });
        await  question.save();
    
    res.status(201).json({message : 'question submitted', status : true});
};


exports.currentAskedQuestion = async (req,res)=> {
    try {
        let question = await RoomQuestion.findOne()
        .where('roomId',req.params.roomId)
        .where('status','in_progress')
        .populate('player','username isCreator')
        .exec();
        res.json({question,message : 'current active question'});

    } catch (error) {
        console.log(error);
        res.status(404).json({message : '404 - not found',status : false});
    }
}