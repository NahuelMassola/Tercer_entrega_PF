const { productServices, cartsServices } = require("../service/index");
const { mapProductCart, calculateQuantityTotal, calculateCartTotal } = require('../utils/calculosCarts');
const fecha = require("../utils/Fecha");
const { v4 } = require("uuid");

const getAllCart = async (req , res) => {
  const getAll = await cartsServices.getAllCart()
  return res.status(200).json({
    message: "Todos los Carritos Existentes",
    Carts: getAll
  })
}

const createCarts = async (req, res) => {
  try {
    const cart = {
      priceTotal: 0,
      quantityTotal: 0,
      products: [],
    }
    await cartsServices.createCart(cart)

    return res.json({
      msg: "Carrito Creado",
      playload: cart,
    })

  } catch (error) {
    return res.status(500).json({
      msg: "Error",
      playload: error.message,
    })
  }
}

const addProductsToCart = async (req, res) => {

  try {
    const { cid } = req.params
    const { products = [] } = req.body
    const cart = await cartsServices.getCartsId(cid);
    if (!cart) {
      return res.json({
        msg: "Carrito no Encontrado",
        playload: cart,
      })
    }

    let { productCartList } = await mapProductCart(products)

    const productCart = {
      priceTotal: calculateCartTotal(productCartList),
      quantityTotal: calculateQuantityTotal(productCartList),
      products: productCartList,
    }
    await cartsServices.updateToCart(cid, productCart)
    return res.json({
      msg: "Productos Agregados",
      playload: productCart,
    })

  } catch (error) {
    return res.status(500).json({
      msg: "Error",
      playload: error.message,
    })
  }
}

const bdgetCartId = async (req, res) => {
  try {
    const { cid } = req.params
    const cart = await cartsServices.getCartsId(cid);
    if (cart) {
      return res.json({
        msg: "Carrito Encontrado",
        Cart: cart,
      })
    }
  } catch (error) {
    return res.status(500).json({
      msg: "error",
      playload: error.message,
    })
  }
}


const emptyToCart = async (req, res) => {
  try {
    const { cid } = req.params;
    const Cart = await cartsServices.getCartsId(cid);
    Cart.products = [];
    Cart.quantityTotal = 0
    Cart.priceTotal = 0
    await cartsServices.updateToCart(cid, Cart)
    return res.json({
      msg: "Carrito Vacio",
    })

  } catch (error) {
    return res.status(500).json({
      msg: "error",
      playload: error.message,
    })
  }

}

const deleteProductToCart = async (req, res) => {
  try {
    const { products = [] } = req.body
    let { productCartList } = await mapProductCart(products)
    const { cid, pid } = req.params;
    const Cart = await cartsServices.getCartsId(cid);
    if (!Cart) {
      return res.status(400).json({
        msg: "Carrito no encontrado",
        ok: false,
      })
    }

    const product = await productServices.getProductId(pid);
    if (!product) {
      return res.status(400).json({
        msg: "Producto no encontrado en Base de Dato",
        ok: false,
      })
    }


    const findProductTocart = Cart.products.some(({ product }) => product._id == pid)

    if (!findProductTocart) {
      return res.status(400).json({
        msg: "Producto no existe en el carrito",
        ok: false,
      })
    }
    Cart.products = Cart.products.filter(({ product }) => product._id != pid)
    Cart.quantityTotal = calculateQuantityTotal(productCartList)
    Cart.priceTotal = calculateCartTotal(Cart.products)
    await cartsServices.updateToCart(cid, Cart)
    return res.status(201).json({
      msg: "Producto Eliminado",
      Cart: Cart
    })

  } catch (error) {
    return res.status(500).json({
      msg: "error",
      playload: error.message,
    })
  }
}


const updateToQuantityProduct = async (req, res) => {
  try {
    const { cid, pid, } = req.params;
    const { quantity = 0 } = req.body;

    const Cart = await cartsServices.getCartsId(cid);
    if (!Cart) {
      return res.status(400).json({
        msg: "Carrito no encontrado",
        ok: false,
      })
    }
    const product = await productServices.getProductId(pid);
    if (!product) {
      return res.status(400).json({
        msg: "Producto no encontrado en base de Datos",
        ok: false,
      })
    }
    const findProductTocart = Cart.products.findIndex(({ product }) => product._id == pid)

    if (findProductTocart === -1) {
      return res.status(400).json({
        msg: "Producto no encontrado en el Carrito",
        ok: false,
      })
    }
    Cart.products[findProductTocart].quantity += quantity
    Cart.priceTotal = calculateCartTotal(Cart.products)
    await cartsServices.updateToCart(cid, Cart)
    return res.status(201).json({
      msg: "Cantidad Actualizada",
      Cart: Cart
    })


  } catch (error) {
    return res.status(500).json({
      msg: "error",
      playload: error.message,
    })
  }

}


const updateToProductsToCart = async (req, res) => {

  try {
    const { cid } = req.params
    const Cart = await cartsServices.getCartsId(cid);
    if (!Cart) {
      return res.status(400).json({
        msg: "Carrito Inexistente",
        ok: false,
      })
    }
    const { products = [] } = req.body
    let { productCartList } = await mapProductCart(products)

    const upateCart = {
      priceTotal: calculateCartTotal(productCartList),
      quantityTotal: calculateQuantityTotal(productCartList),
      products: productCartList,
    }
    await cartsServices.updateToCart(cid, upateCart)

    return res.json({
      msg: "Carrito Actualizado",
      payload: { productCartList, productsNotFound },
      carts: Cart
    })

  } catch (error) {
    return res.status(500).json({
      msg: 'Error',
      payload: error.message,
    })
  }
}

const pucharse = async (req, res) => {
  try {
    const { email } = req.user.user
    let sinStock = []
    let tiketTotal = 0
    const { cid } = req.params
    const cart = await cartsServices.getCartsId(cid);
    if (!cart) {
      return res.json({
        msg: "Carrito no Encontrado",
        playload: cart,
      })
    }


    for (let i = 0; i < cart.products.length; i++) {
      const productBd = await productServices.getProductId(cart.products[i].product._id)

      if (productBd.stock >= cart.products[i].quantity) {
        tiketTotal += productBd.price * cart.products[i].quantity
        productBd.stock = productBd.stock - cart.products[i].quantity
        await productServices.updateProduct(productBd.id, productBd)
      } else {
        sinStock.push(productBd.id)
      }

    }
    let { productCartList } = await mapProductCart(sinStock)
    const upateCart = {
      priceTotal: calculateCartTotal(productCartList),
      quantityTotal: calculateQuantityTotal(productCartList),
      products: productCartList,
    }
    await cartsServices.updateToCart(cid, upateCart)
    const ticket = {
      code: v4(),
      purchase_datetime: fecha(),
      amount: tiketTotal,
      parchaser: email,
    }
    const createTicket = await cartsServices.createTicket(ticket)

    if (!createTicket) {
      return res.json({
        msg: "No se Pudo Crear Ticket",
        playload: createTicket,
      })
    }
    return res.json({
      msg: "Tiket Creado",
      playload: createTicket,
      ProductSinStock: sinStock,
    })
  } catch (error) {
    return res.status(500).json({
      msg: "error",
      playload: error.message,
    })
  }
}





module.exports = {
  getAllCart,
  createCarts,
  addProductsToCart,
  bdgetCartId,
  deleteProductToCart,
  emptyToCart,
  updateToQuantityProduct,
  updateToProductsToCart,
  pucharse,
}

