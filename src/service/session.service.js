
const userModel = require('../dao/models/user.model');

class SessionService{
    constructor(dao){
     this.dao = dao
    }


getSession = (email, password) => this.dao.get({email, password});


getUserId = (id) => this.dao.getId(id);


getEmail = async (email) => this.dao.getEmail(email);


createUser = (user)=>   this.dao.create(user)


}
module.exports= SessionService