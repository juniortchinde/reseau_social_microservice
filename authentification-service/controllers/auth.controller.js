const User = require('../model/user.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const createToken = (id) =>{
    return jwt.sign({id}, process.env.TOKEN_SECRET,{
        expiresIn: "1d"
    })
};


module.exports.register = async (req, res) =>{
   const { name, email, password} = req.body;
    try {
        const hash = await bcrypt.hash(password, 10);
        await User.create({name, email, password: hash});
        res.status(201).json({message:"User registered successfully"});
    }
    catch(err){
        console.log(err)
        res.status(400).json(err);  
    }
};

module.exports.login = async(req, res) => {

    try{
    
        const { email, password } = req.body;
        const user = await User.findOne({email})
        
        if(!user){
            return res
                .status(401)
                .json({ error: true, message: "Invalid email or password" });
        }
        const verifiedPassword = bcrypt.compareSync(password, user.password);
        if(!verifiedPassword){
            return res
                .status(401)
                .json({ error: true, message: "Invalid email or password" });
        }
        const token =  createToken(user._id)

        const userInfo = {
            _id: user._id,
            name: user.name,
            email: user.email
        }
        return res.status(200).json({
            error: false,
            token,
            message: "Logged in successfully",
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: true, message: "Internal Server Error" });
    }
};


module.exports.updateProfil = async(req, res) => {
    try {
        const { name, avatar } = req.body;
        await User.updateOne(
            {_id: req.auth.userId},
        {avatar, name}
        )

        return res.status(200).json({success: true, message:"User updated successfully"});
    }
    catch (err){
        console.error(err);
        return res.status(500).json({ error: true, message: "Internal Server Error" })
    }
}