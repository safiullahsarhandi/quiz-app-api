
const Question = require("../../../models/Question");
const User = require("../../../models/User");
const {getUserForProfile} = require('../../../queries');
const { generateHash } = require("../../../services/generate_hash");
const {compare} = require('bcryptjs');
const Setting = require("../../../models/Setting");
const { delete_file } = require("../../../services/delete_file");
exports.index = async (req,res)=> {
    let user = await getUserForProfile(req.userId);
    
    res.json({user});
};

exports.update = async (req,res)=>{
    const user_image =
      req.files &&
      req.files.user_image &&
      req.files.user_image[0] &&
      req.files.user_image[0].path;
    let user = await User.findById(req.userId);
    let old_image = user.user_image;
    
    if(user_image != undefined)
        delete_file(old_image);
    try {
        await User.findByIdAndUpdate(req.userId,{
            ...req.body,
            user_image,
        });
        // await user.save();
    } catch (error) {
        console.log(error);
        res.status(422).json({message : error.message, status : false});
    }

    res.json({message : 'profile updated successfully'});

};

exports.changePassword = async (req,res)=> {
    let { current_password,password } = req.body;
    
    let user = await User.findById(req.userId).populate("auth", ["email","password"]);
    let {password : hashedPassword} = user.auth;
    
    let isValidPassword = await compare(current_password,hashedPassword);
    if(!isValidPassword)
       return res.status(422).json({errors : {current_password : ['invalid current password']},status : false});
       
    try {
       await user.auth.updateOne({
           password : await generateHash(password),   
        });
        
    } catch (error) {
            console.log(error);
    }
        res.json({status : true,message : 'account has been updated'});
}


exports.saveSettings = async (req,res)=> {
    try {
        
        await Setting.findOneAndUpdate({userId : req.userId},req.body,{upsert : true,}, function(err, doc) {
            if (err) return res.send(500, {error: err});
            return res.json({message : 'settings updated',status : true});
            // return res.send('Succesfully saved.');
        });
    } catch (error) {
            console.log(error);
    }
}