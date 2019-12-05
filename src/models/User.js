const mongoose = require('mongoose');
const { Schema } = mongoose;

const bcrypt = require('bcryptjs');

const UserSchema = new Schema({
 // Id:{
   //   type: String,
     // required: true
  //},
  Nombre: { 
      type: String,
       required: true
        },
        Apellido:{
            type: String,
            required: true
        },
        Email: { 
            type: String, 
            required: true 
            },   
        password: { 
            type: String, 
            required: true 
            }
});
UserSchema.methods.encryptPassword= async (password) => {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  return hash;
};

UserSchema.methods.matchPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};
UserSchema.methods.encryptPassword= async(password)=>{
  const salt = await bcrypt.genSalt(15);
  const hash = bcrypt.hash(password, salt);
  return hash;
};

UserSchema.methods.matchPassword = async function (password){
  return await bcrypt.compare(password, this.password);
}

module.exports = mongoose.model('User', UserSchema);