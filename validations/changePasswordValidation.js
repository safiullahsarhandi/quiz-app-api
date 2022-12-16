const Validator = require('validatorjs');

module.exports = (req,res,next)=> {
    const validation = new Validator(req.body,{
        current_password : 'required',
        password : 'required|confirmed',
        
    });
    if(validation.fails()){
        res.json({errors : validation.errors.all(), status : false});
    }

    return next();
    
}