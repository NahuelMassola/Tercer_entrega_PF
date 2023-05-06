const userModel = require ('../models/user.model')

class BdsessionManager {
   
  get = (email, password) => userModel.findOne({email, password});
  
  getId = (id) => userModel.findById(id);
  
  getEmail = (email) => userModel.findOne(email);
  
  create = (user)=>{
      const { firstName, lastName, email, age, password,rol, cart} = user
      return userModel.create({firstName , lastName, email, age, password, rol,cart })
  }


}
 
module.exports = new BdsessionManager