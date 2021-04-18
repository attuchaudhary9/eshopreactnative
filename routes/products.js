const {Product} = require('../models/product');
const express = require('express');
const { createProduct, getProduct, getAllProducts,updateProduct, deleteProduct, productsCount, featuredProducts,uploadOptions, updateMultiImage } = require('../controllers/products');
const router = express.Router();

router.get("/:id",getProduct);
router.get(`/`, getAllProducts)
router.post(`/`, uploadOptions.single("image"), createProduct)
router.put(`/:id`,uploadOptions.single("image"), updateProduct)
router.delete(`/:id`, deleteProduct)
router.get(`/get/count`,productsCount)
router.get(`/get/featured/:id`,featuredProducts)
router.put(
    '/gallery-images/:id',
    uploadOptions.array('images', 10),updateMultiImage),



module.exports =router;