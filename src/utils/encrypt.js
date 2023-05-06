const bcrypt = require('bcrypt');

const isValidPassword = async (psw , encryptedPsw) => {
    const validValue = await bcrypt.compareSync(psw, encryptedPsw);
    return validValue; 
}

const createHashValue = async (val) => {
    const salt = await bcrypt.genSalt();
    return await bcrypt.hashSync(val , salt);
}


module.exports = {
    isValidPassword ,
    createHashValue
}