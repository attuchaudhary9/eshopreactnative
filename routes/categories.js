const express = require('express');
const { deleteCategory, getCategory, getAllCategory, createCategory,updateCategory } = require('../controllers/categories');
const router = express.Router();

//routers
router.get(`/`, getAllCategory)
router.get(`/:id`,getCategory)
router.post("/",createCategory)
router.delete("/:id",deleteCategory)
router.put("/:id",updateCategory)

module.exports =router;