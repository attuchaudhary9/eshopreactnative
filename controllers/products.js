const { Product } = require("../models/product");
const {Category} = require("../models/category")
const mongoose = require("mongoose");
const { request } = require("express");
exports.createProduct = async (req, res) =>{

   let category = await Category.findById(req.body.category);
    if(!category){
        return res.status(400).json({
            message:"Invalid category"
        })
    }
    var product = new Product({
        name: req.body.name,
        description:req.body.description,
        richDescription:req.body.richDescription,
        countInStock: req.body.countInStock,
        image: req.body.image,
        brand:req.body.brand,
        price:req.body.price,
        category:req.body.category,
        rating:req.body.rating,
        numReview:req.body.numReview,
        dateCreated:req.body.dateCreated,
        isFeatured:req.body.isFeatured,
        })

        product = await product.save();
        if(!product){
            return res.status(404).json({
                message:"No product is created"
            })
        }
        res.status(200).json({
            product
        })
       
}

exports.getProduct = async (req,res)=>{
    const product = await Product.findById(req.params.id).populate("category").select("name image _id");
    if(!product){
        return res.status(404).json({
            error:"Product not found"
        })
    }
    res.send(product);
}

exports.getAllProducts = async (req, res) => {
    let filter = {};
    if (req.query.categories) {
        filter = { category : req.query.categories.split(',') };
    }

    const productList = await Product.find(filter).populate('category');

    if (!productList) {
        res.status(500).json({ success: false });
    }
    res.send(productList);
}

exports.updateProduct = async (req,res)=>{
    if(!mongoose.isValidObjectId(req.params.id)){
        return res.status(404).json({
            error:"Invalid product id"
        })
    }
    let category = await Category.findById(req.body.category);
    if(!category){
        return res.status(400).json({
            message:"Invalid category"
        })
    }
    const product = await Product.findByIdAndUpdate(req.params.id,{
        name: req.body.name,
        description:req.body.description,
        richDescription:req.body.richDescription,
        countInStock: req.body.countInStock,
        image: req.body.image,
        brand:req.body.brand,
        price:req.body.price,
        category:req.body.category,
        rating:req.body.rating,
        numReview:req.body.numReview,
        dateCreated:req.body.dateCreated,
        isFeatured:req.body.isFeatured,
        },{
            new:true
        })
        
        if(!product){
            return res.status(404).json({
                error:"The product cannot be updated"
            })
        }
        res.send(product);
}

exports.deleteProduct = async (req,res)=>{
    if(!mongoose.isValidObjectId(req.params.id)){
        return res.status(404).json({
            error:"Invalid product id"
        })
    }
    const product = await Product.findByIdAndUpdate(req.params.id)
    if(!product){
        return res.status(400).json({
            error:"Product not found"
        })
    }
    res.send(`Sucessfully deleted the product`)
}

exports.productsCount = async (req,res)=>{
    const productCount = await Product.countDocuments((count)=>count);
    if(!productCount){
        return res.status(400).json({
            error:"There is no product"
        })
    }
    res.status(200).json({
        productCount : productCount
    })
}

exports.featuredProducts = async (req,res)=>{
   const count = req.params.count ? request.params.count : 0;
   const products =  await Product.find({isFeatured:true}).limit(+count)
   if(!products){
    return res.status(400).json({
        error:"Product not found"
    })
}
res.send(products)
}