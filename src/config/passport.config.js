const passport = require('passport');
const passportLocal = require('passport-local');
const GithubStrategy = require('passport-github2');
const userModelGithub = require('../dao/models/user.modelGithub');
const local = require('passport-local');
const { createHashValue, isValidPassword } = require('../utils/encrypt');
const userModel = require('../dao/models/user.model');
const { generateToken } = require('../utils/generateToken');
const { REGISTER_STRATEGY , GITHUB_CLIENT_SECRET, GITHUB_CLIENT_ID } = require('./config');
const { sessionServices } = require('../service');


const LocalStrategy = local.Strategy;

const initializePassport = () => {
    passport.use(REGISTER_STRATEGY , new LocalStrategy({passReqToCallback:true, usernameField:'email'} , async (req ,username ,password , done) => {
        const { firstName , lastName , email } = req.body
        try {
            let user = await sessionServices.getUserId({email: username});
            if (user){
                return done (null , false);
            } else { 
            if (email === 'adminCoder@coder.com') {
            const user = {
                firstName,
                lastName,
                email,
                password: await createHashValue(password),
                rol: 'Administrador'
            } 
            let result = await sessionServices.createUser(user)
                done(null ,result)
                } else {
                const user = {
                    firstName,
                    lastName,
                    email,
                    password:await createHashValue(password),
                    rol: 'Usuario'
            } 
            let result = await sessionServices.createUser(user)
                done(null , result);
        }}
        } catch (error) {
            return done('Error al obtener usuario: ' + error)
        }
    }))


    passport.use('login' , new passportLocal.Strategy(
        {
            usernameField: 'email',
            passReqToCallback: true
        }, 
            async(req, username ,password, done)=>{
        try {
            const user = await sessionServices.getEmail({email: username});
            const isValidPasswords = await isValidPassword(password , user.password)
            if(user && isValidPasswords) {
                const token = generateToken({ id: user.id , rol: user.rol})
                if(token){
                    done(null , {token: token})
                } else {
                    done(null , false);
                }
            } else {
                done(null , false)
            }
        } catch (error) {
            console.log(error)
        }
    }))


    passport.use(
        "github",
        new GithubStrategy({
            clientID: GITHUB_CLIENT_ID,
            clientSecret: GITHUB_CLIENT_SECRET,
            callbackUrl: "http://localhost:8080/api/session/github/callback",
        },
        async (accessToken , refreshToken , profile , done) => {
            try {
            let user = await sessionServices.getSession({ email: profile._json?.email});
            if(!user){
                let addNewUser = {
                    firstName: profile._json.name,
                    email: profile._json?.email,
                    password: ""
                };
                let newUser = await sessionServices.createUser(addNewUser);
                
                done(null , newUser);
            } else {
                done(null ,user);
            }
            } catch (error) {
                return done(error);
            }
        } 
        )
    );

    passport.serializeUser((user , done) =>{
        done(null , user._id);
    })

    passport.deserializeUser(async (id , done) => {
        let user = await userModel.findById({_id: id})
        done (null , user)
    });
}


module.exports = initializePassport ;
