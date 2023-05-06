const  adminPermission  =  async  (req,  res,  next)  =>  {
       
      const {user}= req.user
      if  (!user  ||  user.rol  !==  'administrador')  {
        return  res.status(401).json({
          status:  'error ',
          mensaje:  'Usuario  no  autorizado  ',
        });
     }
   
   next() 
}   

const  userPermission  =  async  (req,  res,  next)  =>  {
  const {user}= req.user
  if  (!user  ||  user.rol  !==  'user')  {
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