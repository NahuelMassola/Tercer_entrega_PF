const mongoose = require('mongoose')
const userCollection = ('usersGithub')

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
    },
    lastName:{
        type: String,
        
    },
    email: {
        type: String,
        
    },
    password: {
        type: String,
        
    }, 
    rol: {
        type: String,
    }
} , {
    versionKey: false,
    timestamps:true
})

const userModelGithub = mongoose.model(userCollection , userSchema);

module.exports = userModelGithub;