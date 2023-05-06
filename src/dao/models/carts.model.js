const mongoose = require('mongoose')

const cartsColection = "carts"

const cartsSchema = new mongoose.Schema(
    {
      priceTotal:Number,
      quantityTotal:Number,
      
      products: {
            type:[
              {
                product:{
                  type: mongoose.Schema.Types.ObjectId,
                  ref:"products",
                },
                quantity:Number,
                price:Number,
                
              }
            ],
            default:[],
    }
    },{
      versionKey: false,
      timestamps:true
  })   


const cartsModel = mongoose.model(cartsColection , cartsSchema);
module.exports = cartsModel;

