const  adminPermission  =  async  (req,  res,  next)  =>  {
      const {user}= req.user
      if  (!user  ||  user.rol  !==  'administrador')  {
        console.log(user)
        return  res.status(401).json({
          status:  'error ',
          mensaje:  'Usuario  no  autorizado  ',
        });
    }
    next() 
}   

const  userPermission  =  async  (req,  res,  next)  =>  {
  const {user}= req.user
  if  (!user  ||  user.rol  !==  'USER')  {
    return  res.status(401).json({
      status:  'error ',
      mensaje:  'Usuario  no  autorizado  ',
    });
}
next() 
}   

module.exports = {
  adminPermission,
  userPermission
  
}