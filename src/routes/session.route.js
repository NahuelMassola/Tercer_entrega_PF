const {Router} = require('express')
const sessionController= require('../controller/session.controller')
const passport = require('passport')
const passportCustom = require('../utils/passportCall')
const { REGISTER_STRATEGY, LOGIN_STRATEGY, JWT_STRATEGY } = require('../config/config')
const { adminPermission } = require('../utils/middleware/isUser')
const router = Router()

//register
router.post('/register', passport.authenticate(REGISTER_STRATEGY,{session:false}) , sessionController.loginRegister)

//login
router.post('/login',passport.authenticate(LOGIN_STRATEGY,{session:false}), sessionController.sessionLogin)


//current
router.get('/current',passportCustom(JWT_STRATEGY),adminPermission,sessionController.getCurrent)

//Github
router.get('/github', passport.authenticate("github" , {scope: ["user:email"]}), async (req , res ) => {});
router.get('/github/callback' , passport.authenticate("github" , {failureRedirect: "/login"}), sessionController.github);

module.exports = router;