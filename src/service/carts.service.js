const cartsModel = require("../dao/models/carts.model");

class CartService {
    constructor(dao) {
        this.dao = dao
    }

    getCartsId = (id) => this.dao.getCartsId(id);

    CreateCart = (carts) => this.dao.create(carts);

    updateToCart = (cid,cart) => this.dao.updateToCart(cid,cart)

    createTicket = (ticket) => this.dao.createTicket(ticket)
}

module.exports = CartService
