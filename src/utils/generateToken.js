const jwt = require('jsonwebtoken');
const { PRIVATE_KEY_JWT } = require('./constants');


const generateToken = (payload) => {
    const token = jwt.sign({payload}, PRIVATE_KEY_JWT, {expiresIn:'24h'});
    return token;
}

module.exports ={
    generateToken,
}