const Answer = require("../../../models/Answer");
const Player = require("../../../models/Player");
const Rate = require("../../../models/Rate");
const {Types} = require('mongoose');
exports.store = async (req,res)=>{
    let answer;
    let player;
    // fetch answer
    try{
        answer = await Answer.findById(req.body.answerId).lean();
        if(!answer)
            throw new Error('404 - answer not found');
    }catch(error){
        res.status(404).json({message : error.message,status : false});
    }
    // fetch player
    try{
        player = await Player.findById(req.body.playerId).lean();
        if(!player)
            throw new Error('player not found');
    }catch(error){
        res.status(404).json({message : error.message,status : false});
    }
    if(answer.roomQuestionId.toString() !== req.body.questionId.toString())
        res.status(409).json({message : 'please provide valid roomQuestionId value',status : false});
        try{
            
        let rate = await Rate.findOneAndUpdate({
            playerId : player._id,
        },req.body,{
            upsert : true,
        });
        
    }catch(error){
        
        res.status(409).json({message : 'something went wrong',status : false});
    }
    
    
    res.status(201).json({message : 'rated',status : true});
};


exports.ratings = async (req,res)=> {
    
    try {
        let players = await Player.aggregate()
            .match({
                roomId : Types.ObjectId(req.params.roomId),
            })
            .lookup({
                from : 'rates',
                localField : '_id',
                foreignField : 'playerId',
                as : 'rates',
            })
            .addFields({
                ratings  : "$rates.rate",
            })
            .project({
                avg: { $avg: "$ratings"},
                roomId : 1,
                username : 1,
            })
            .exec();
        return res.json({players, message : 'game results'});
    } catch (error) {
        
    }
    
}

