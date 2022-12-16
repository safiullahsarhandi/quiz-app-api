const Validator = require('validatorjs');
module.exports = async (req,res,next)=> {
    const validation = new Validator(req.body,{
        noOfPlayers : 'required',
        timer : 'required',
        rounds : 'required',
    });
    if(validation.fails()){
        return res.status(422).json({errors : validation.errors.all(), status : false});
    }

    next();

}