const productModel = require("../dao/models/products.model");


class ProductService {
    constructor() {
        this.dao =  this.dao
    }

    getProducts = (page, limit , sort, query) => this.dao.getProduct (query,page, limit, sort);
    
    addProduct = (product) => this.dao.addProduct(product);

    getProductId = (id) => this.dao.getProductId(id);

    UpdateProduct = (id, product) => this.dao.UpdateProduct(id, product);

    DeleteProductId = (id) => this.dao.deleteProductId(id);
}



module.exports = ProductService