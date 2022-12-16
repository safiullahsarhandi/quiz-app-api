const Validator = require('validatorjs');
module.exports = (req,res,next)=>{
    const validation = new Validator(req.body,{
        name : 'required',
    });

    if(validation.fails()){
        res.status(422).json({errors : validation.errors.all()});
    }

    return next();
}