
const DtoUser = ( user ) => {
    const newUserDto = {
        id: user.user._id,
        firstName: user.user.firstName,
        lastName: user.user.lastName,
        email: user.user.email,
        rol: user.user.rol
    }
    return newUserDto
}

module.exports = DtoUser