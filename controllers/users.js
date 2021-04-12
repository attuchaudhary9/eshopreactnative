const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../models/user");

exports.createUser = async (req,res)=>{
    
   let user = new User({
        name:req.body.name,
        email:req.body.email,
        passwordHash:bcrypt.hashSync(req.body.password,10),
        street:req.body.street,
        apartment:req.body.apartment,
        city:req.body.city,
        country:req.body.country,
        phone:req.body.phone,
        isAdmin:req.body.isAdmin
    })
    user = await user.save();
    if(!user){
        return res.status(404).json({
            error:"User is not added to database"
        })
    }
    user.passwordHash = undefined;
    res.status(200).send(user)

} 

exports.getAllUser = async (req, res) =>{
    const userList = await User.find().select("-passwordHash");

    if(!userList) {
        res.status(500).json({success: false})
    } 
    res.send(userList);
}
exports.getUser = async (req,res)=>{
    const singleUser = await User.findById(req.params.id).select("-passwordHash")
    if(!singleUser){
        return res.status(500).json({
            success:false,
            message:"there is no User found by this id"
        })
    }
    res.status(200).json(singleUser);
}

exports.loginUser= async (req,res)=>{
    const user = await User.findOne({email:req.body.email})
    if(!user){
        return res.status(400).json({
            error:"Email is not found in our database"
        })
    }
    const secret = process.env.SECRET;
    if(user && bcrypt.compareSync(req.body.password,user.passwordHash)){
        const token = jwt.sign({
            userId:user.id,
            isAdmin:user.isAdmin
        },secret,{
            expiresIn:"1d"
        })
        res.status(200).send({
            user:user.email, token :  token
        })
    }else{
        return res.status(404).send({
            error:"password is not matched"
        })
    }
}

exports.getCount =  async (req, res) =>{
    const userCount = await User.countDocuments((count) => count)

    if(!userCount) {
        res.status(500).json({success: false})
    } 
    res.send({
        userCount: userCount
    });
}

exports.deletUser =  (req, res)=>{
    User.findByIdAndRemove(req.params.id).then(user =>{
        if(user) {
            return res.status(200).json({success: true, message: 'the user is deleted!'})
        } else {
            return res.status(404).json({success: false , message: "user not found!"})
        }
    }).catch(err=>{
       return res.status(500).json({success: false, error: err}) 
    })
}
exports.registerUser = async (req,res)=>{
    let user = new User({
        name: req.body.name,
        email: req.body.email,
        passwordHash: bcrypt.hashSync(req.body.password, 10),
        phone: req.body.phone,
        isAdmin: req.body.isAdmin,
        street: req.body.street,
        apartment: req.body.apartment,
        zip: req.body.zip,
        city: req.body.city,
        country: req.body.country,
    })
    user = await user.save();

    if(!user)
    return res.status(400).send('the user cannot be created!')

    res.send(user);
}

exports.updatePassword = async (req, res)=> {

    const userExist = await User.findById(req.params.id);
    let newPassword
    if(req.body.password) {
        newPassword = bcrypt.hashSync(req.body.password, 10)
    } else {
        newPassword = userExist.passwordHash;
    }

    const user = await User.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            email: req.body.email,
            passwordHash: newPassword,
            phone: req.body.phone,
            isAdmin: req.body.isAdmin,
            street: req.body.street,
            apartment: req.body.apartment,
            zip: req.body.zip,
            city: req.body.city,
            country: req.body.country,
        },
        { new: true}
    )

    if(!user)
    return res.status(400).send('the user cannot be created!')

    res.send(user);
}