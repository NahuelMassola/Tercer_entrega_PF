const userModel = require("../dao/models/user.model");


class SessionService {
    constructor() {
        this.dao = this.dao
    }

    getSession = (email, password) => this.dao.getSession({email, password});
    
    getUserId = (id) => this.dao.getUserId({ id});
    
    getEmail = (email) => this.dao.getEmail(email);

    createUser = (user)=> this.dao.createUser(user);

}

module.exports = SessionService