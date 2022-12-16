const Validator = require('validatorjs');
module.exports = async (req,res,next)=> {
    const validation = new Validator(req.body,{
        username : 'required',
    });
    if(validation.fails()){
        res.status(422).json({errors : validation.errors.all(), status : false});
    }

    next();

}