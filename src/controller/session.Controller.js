const { COOKIE_USER}=  require("../config/config");
const { DtoUser } = require("../dao/DTOs/dtoUsers");
const { productServices } = require("../service");


const sessionLogin = async (req,res)=>{
    res
    .cookie(COOKIE_USER, req.user.token, { maxAge: 300000, httpOnly: true })
    .send( req.user )
}

const loginRegister = async (req,res)=>{
    res.send(req.user) 
}  


const getCurrent = (req, res)=>{
    newUser = DtoUser(req.user)
    res.send(newUser) 
}  

const github = async(req, res) =>{
    try {
        const products = await productServices.getProduct();
        req.user.rol = "USER"
        res.render("viewProduct", {
            products: products,
            firstName: req.user.firstName,
            rol: req.user.rol
            });
            console.log(products)
    } catch (error) {
        console.log(error)
    }
}


module.exports={
    sessionLogin,
    loginRegister,
    getCurrent,
    github
}