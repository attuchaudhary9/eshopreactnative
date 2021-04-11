const { Category } = require("../models/category")

//get All the categories
exports.getAllCategory= async (req, res) =>{
    const categoryList = await Category.find();
     if(!categoryList) {
        res.status(500).json({success: false})
    } 
    res.status(200).send(categoryList);
}

//get a single category

exports.getCategory = async (req,res)=>{
    const singleCategory = await Category.findById(req.params.id)
    if(!singleCategory){
        return res.status(500).json({
            success:false,
            message:"there is no category found by this id"
        })
    }
    res.status(200).json(singleCategory);
}

//create a category
exports.createCategory = async (req,res)=>{
    let category = new Category({
       name : req.body.name,
       icon:  req.body.icon,
       color :  req.body.color
    })
    category = await category.save();
    if(!category){
        return res.status(404).json({
            error:"The category cannot be created"
        })
    }
    res.send(category)
}
//update a category
 exports.updateCategory = async (req,res)=>{
     const category = await Category.findByIdAndUpdate(req.params.id,{
         name:req.body.name,
         color:req.body.color,
         icon:req.body.icon
     },{
         new:true
     })
     if(!category){
        return res.status(404).json({
            error:"The category cannot be updated"
        })
    }
    res.send(category)
     
 }
//delete a category
exports.deleteCategory = (req,res) => {
    Category.findByIdAndRemove(req.params.id,(err,category)=>{
        if(err){
            return res.status(404).json({
                success:false,
                message:err
            })
        }else{
             return res.status(200).json({
                 success:true,
                 message:`Category deleted ${category.name}`}
             )   
      }
    })
  }