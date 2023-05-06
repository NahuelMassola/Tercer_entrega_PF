

const adminPermission = async (req , res , next) => {
    if (!user || user.rol !== 'administrador') {
        return res.status(401).json({
            status: 'Error',
            message: 'Usuario no Autorizado'});
    }
    next();
}

const userPermission = async (req , res , next) => {
    if (!user || user.rol !== 'usuario') {
        return res.status(401).json({
            status: 'Error',
            message: 'Usuario no Autorizado'});
        }
        next();
}

module.exports = {
    userPermission,
    adminPermission
}