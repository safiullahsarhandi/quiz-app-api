const Validator = require('validatorjs');

module.exports = (req,res,next)=> {
    const validation = new Validator(req.body,{
        roomId : 'required',
        question : 'required',
        
    });
    if(validation.fails()){
        res.json({errors : validation.errors.all(), status : false});
    }

    return next();
    
}