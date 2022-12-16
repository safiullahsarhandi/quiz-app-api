const Question = require("../../models/Question");
const QuestionRequest = require("../../models/QuestionRequest");

exports.index = async (req,res) =>{
    let questions = await Question.find();
    res.json({questions});
}
exports.show = async (req,res)=>{
    try {
        let question = await Question.findById(req.params.id);        
        return res.json({question});
    } catch (error) {
        // console.log(error);
        res.status(404).send({error : 'question not found', status : false});
    }

}


