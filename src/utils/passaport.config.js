const passport = require("passport");
const passportLocal = require("passport-local");
const { hashPassword, comparePassword } = require("./hashPassword");
const {Strategy, ExtractJwt } = require('passport-jwt');
const { generateToken } = require("./jwt");
const { COOKIE_USER, JWT_STRATEGY, REGISTER_STRATEGY, LOGIN_STRATEGY, PRIVATE_KEY_JWT, GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } = require("../config/config");
const { sesionServices, cartsServices } = require("../service");
const { default: mongoose } = require("mongoose");
const GithubStrategy = require('passport-github2');
const userModelGithub = require('../dao/models/userModelGithub')




const cookieEstractor = (req) =>{
  let token = null;
  if(req && req.cookies) {
    token = req.cookies[COOKIE_USER]
  }
    return token;
} 


const initPassaport = () => {

passport.use(
  JWT_STRATEGY, new Strategy ({
      jwtFromRequest:ExtractJwt.fromExtractors([cookieEstractor]),
      secretOrKey: PRIVATE_KEY_JWT
  }, async(jwt_payload, done) => {
    try {
          const {payload} = jwt_payload
          const user = await sesionServices.getUserId (payload.id);
          done (null, {user})
    } catch (error) {
      done(error)
    }
})
);



  passport.use(
    REGISTER_STRATEGY ,
    new passportLocal.Strategy(
      {
        passReqToCallback: true,
        usernameField: "email",
      },async (req, username, password, done) => {
        
          const { firstName, lastName, age } = req.body;

        try {
          const exitEmail = await sesionServices.getEmail({email:username});
            if (exitEmail) {
              done('register Error', false,{message:"Usuario Existente con ese Emial"} );
            } else {
              const hash = await hashPassword(password);
              const cart = await cartsServices.createCart({
                priceTotal:0, 
                quantityTotal:0,
                products:[],
              })
              const id = mongoose.Types.ObjectId(cart);

              if (username === "adminCoder@coder.com") {
                const user = await sesionServices.createUser({
                  firstName: firstName,
                  lastName: lastName,
                  age:age,
                  email: username,
                  password: hash,
                  cart:id,
                  rol: "administrador",
                });
                done(null, user);
              } else {
                const user = await sesionServices.createUser({
                  firstName: firstName,
                  lastName: lastName,
                  age:age,
                  email: username,
                  password: hash,
                  cart:id
                  
                });
                console.log(id)
                console.log(cart)
                console.log(user)
                done(null, user);
              }
            }
            
        } catch (error) {
            done(error)
        }
      }
    )
  );


  passport.use(
    LOGIN_STRATEGY ,
    new passportLocal.Strategy(
      {
        passReqToCallback: true,
        usernameField: "email",
      },async (req, username, password, done) => {
        try {
          const user = await sesionServices.getEmail({email:username})
          const isVadidPassword = await comparePassword(password, user.password)
          if (user && isVadidPassword) {
            const token = generateToken({id:user.id, rol:user.rol})
            if (token) {
              done(null, {token:token})

            } else{
              done(null, false); 
            }
          }else{
            done(null, false);  
          }
        } catch (error) {
          done(null, false);
        }
      }
    )
  );
  
  passport.use(
    "github",
    new GithubStrategy({
        clientID: GITHUB_CLIENT_ID,
        clientSecret: GITHUB_CLIENT_SECRET,
        callbackUrl: "http://localhost:8080/api/session/github/callback",
    },
    async (accessToken , refreshToken , profile , done) => {
        try {
        let user = await userModelGithub.findOne({ email: profile._json?.email});
        if(!user){
            let addNewUser = {
                firstName: profile._json.name,
                email: profile._json?.email,
                password: ""
            };
            let newUser = await userModelGithub.create(addNewUser);
            
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

};




module.exports =  initPassaport
