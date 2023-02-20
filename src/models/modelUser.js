const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const SaltRounds = 10;


const UserSchema = new mongoose.Schema({
    nombres: {type:String, required:true},
    apellidos:{type:String, required:true},
    email:{type:String, required:false},
    telefono:{type:String, required:false},
    usuario:{type: String, required:true, unique:true},
    password:{type: String, required:true},
    rol:{type: String, required:true}
});

// UserSchema.pre('save', function(next){
//     if(this.isNew || this.isModified('passwordUser')){
//         const document = this;
//         console.log("pass en el doc:",document.password)
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

UserSchema.methods.isCorrectPassword = function(passwordOld, callback){
    console.log("password enviado: ",passwordOld)
    bcrypt.compare(passwordOld, this.password, function(err, isMatch){
       if(err) return callback(err);
        callback(err, isMatch);
    });
 }


module.exports = mongoose.model('users', UserSchema);