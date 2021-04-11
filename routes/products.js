const {Product} = require('../models/product');
const express = require('express');
const { createProduct, getProduct, getAllProducts,updateProduct, deleteProduct, productsCount, featuredProducts } = require('../controllers/products');
const router = express.Router();

router.get("/:id",getProduct);
router.get(`/`, getAllProducts)
router.post(`/`, createProduct)
router.put(`/:id`, updateProduct)
router.delete(`/:id`, deleteProduct)
router.get(`/get/count`,productsCount)
router.get(`/get/featured/:id`,featuredProducts)



module.exports =router;