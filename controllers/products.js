const { Product } = require("../models/product");
const {Category} = require("../models/category")
const mongoose = require("mongoose");
const { request } = require("express");
const multer  = require('multer')
const FILE_TYPE_MAP = {
    "image/png":"png",
    "image/jpeg":"jpeg",
    "image/jpg":"jpg",
}
const storage = multer.diskStorage({
    
    destination: function (req, file, cb) {
        const isValid = FILE_TYPE_MAP[file.mimetype];
        let uploadError = new Error("invalid image type");
        if(isValid){
            uploadError=null;
        }
      cb(uploadError, 'public/uploads')
    },
    filename: function (req, file, cb) {
        const fileName = file.originalname.split(" ").join("-");
        const extenstion = FILE_TYPE_MAP[file.mimetype]
      cb(null, `${fileName}-${Date.now()}.${extenstion}`)
    }
  })
  
exports.uploadOptions = multer({ storage: storage })



exports.createProduct = async (req, res) =>{
   
   let category = await Category.findById(req.body.category);
    if(!category){
        return res.status(400).json({
            message:"Invalid category"
        })
    }
    const file = req.file;
    if(!file){
        return res.status(400).json({
            message:"No image in the request"
        })
    }
    const basePath = `${req.protocol}://${req.get("host")}/public/uploads/`
    const fileName = req.file.filename
   let product = new Product({
        name: req.body.name,
        description:req.body.description,
        richDescription:req.body.richDescription,
        countInStock: req.body.countInStock,
        image: `${basePath}${fileName}`,
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

exports.updateProduct = async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).send('Invalid Product Id');
    }
    const category = await Category.findById(req.body.category);
    if (!category) return res.status(400).send('Invalid Category');

    const product = await Product.findById(req.params.id);
    if (!product) return res.status(400).send('Invalid Product!');

    const file = req.file;
    let imagepath;

    if (file) {
        const fileName = file.filename;
        const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;
        imagepath = `${basePath}${fileName}`;
    } else {
        imagepath = product.image;
    }

    const updatedProduct = await Product.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            description: req.body.description,
            richDescription: req.body.richDescription,
            image: imagepath,
            brand: req.body.brand,
            price: req.body.price,
            category: req.body.category,
            countInStock: req.body.countInStock,
            rating: req.body.rating,
            numReviews: req.body.numReviews,
            isFeatured: req.body.isFeatured,
        },
        { new: true }
    )
    if (!updatedProduct)
    return res.status(500).send('the product cannot be updated!');

res.send(updatedProduct);
};

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

exports.updateMultiImage =  async (req, res) => {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).send('Invalid Product Id');
        }
        const files = req.files;
        let imagesPaths = [];
        const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;

        if (files) {
            files.map((file) => {
                imagesPaths.push(`${basePath}${file.filename}`);
            });
        }

        const product = await Product.findByIdAndUpdate(
            req.params.id,
            {
                images: imagesPaths,
            },
            { new: true }
        );

        if (!product)
            return res.status(500).send('the gallery cannot be updated!');

        res.send(product);
    }
