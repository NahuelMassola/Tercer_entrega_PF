const {Router} = require('express');
const { createCarts, bdgetCartId, deleteProductToCart, emptyToCart,  updateToQuantityProduct, updateToProductsToCart, pucharse, addProductsToCart, getAllCart } = require('../controller/carts.controller.bd');
const { userPermission } = require('../utils/middleware/isUser');
const passportCustom = require('../utils/passportCall');
const { JWT_STRATEGY } = require('../config/config');


const router =  Router();

//crear
router.post('/', passportCustom(JWT_STRATEGY),  userPermission , createCarts)
//agregar al carrito
router.post('/:cid', passportCustom(JWT_STRATEGY), userPermission , addProductsToCart)
//buscar todos los carritos
router.get ("/", getAllCart)
//buscar carrito por id
router.get('/:cid', bdgetCartId)
//borrar un producto del carrito
router.delete('/:cid/product/:pid', deleteProductToCart);
//vaciar carrito
router.delete('/:cid', emptyToCart);
//actualizar cantidad de producto
router.put('/:cid/product/:pid', updateToQuantityProduct);
//actualizar productos en el carrito
router.put('/:cid', updateToProductsToCart);
//pagar
router.post('/:cid/purchase',passportCustom(JWT_STRATEGY), pucharse);

module.exports = router;

