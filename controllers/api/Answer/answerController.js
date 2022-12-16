const Answer = require("../../../models/Answer");
const Player = require("../../../models/Player");

exports.store = async (req,res)=> {
    
    // fetch player
    let player;
    try{
        player = await Player.findOne()
        .where('roomId').eq(req.body.roomId)
        .where('userId').eq(req.userId)
        .exec();
    }catch(error){
        console.log(error)
        return res.status(409).json({message : 'please join room first',status : false});
    }
    try{
        let answer = new Answer({
            roomQuestionId : req.body.questionId,
            answer : req.body.answer,
            playerId : player._id,       
        });
        await answer.save();
    }catch(error){
        console.log(error);
        res.status(201).json({message : 'something went wrong', status : false});
    }

    res.status(201).json({message: 'answer submitted',status : true});
}


exports.answers = async (req,res)=>{
    try {
        let answers = await Answer.paginate({
            roomQuestionId : req.params.questionId,
        },{
            page : req.query.page || 1,
            limit : req.query.perPage || 10,
            populate : [
                'ratings',
                {
                    path : 'player',
                    select : 'username isCreator',
                },
                {
                    path : 'question',
                    select : "status playerId",
                    populate : {
                        path : 'player',
                        select : 'username isCreator',
                    }
                }
            ]
            
        });
        res.json({message :'answers listing', answers});  
    } catch (error) {
        console.log(error);
        res.status(409).json({message : 'someting went wrong', status : false});
    }
    
}