const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const PostSchema = new mongoose.Schema({
    usuario: {type:String, required:true},
    rol:{type:String, required:true},
    comentario:{type:String, required:true},
    estado:{type:String}
});
// const SaltRounds = 10;
// PostSchema.pre('save', function(next){
//     if(this.isNew || this.isModified('passwordUser')){
//         const document = this;
//         bcrypt.hash(document.password, SaltRounds,(err, hashedPassword)=>{
//             if(err){
//                 next(err);
//             }else{
//                 document.password=hashedPassword;
//                 next();
//             }
//         });
//     }else{
//         next();
//     }
// });

PostSchema.methods.isCorrectPassword = function(passwordUser, callback){
    bcrypt.compare(passwordUser, this.password, function(err, isMatch){
        if(err) return callback(err);
        callback(err, isMatch);
    });
}

module.exports = mongoose.model('posts', PostSchema);