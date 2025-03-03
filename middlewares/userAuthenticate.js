
const User = require('../models/User');
 
const userAuthenticate = async (req, res, next) => {
    try {
   

        const userId = req.params.id; // Assuming the post ID is in the request parameters
        const user = await User.findById(userId);


        if(`"${req.user._id.toString()}"` !== JSON.stringify(user._id)){
            res.status(400).json({
                error:"Failed!! You Are Not The User"
            })
        }else if(!user){
            res.status(400).json({
                error:"User Not Found According To Your Token"
            })  
        }else{
            req.user = user;
            next();
        }
  
     
    } catch (error) {
        console.log(error)
        res.status(401).send({ error: 'Please authenticate.' });
    }
};

module.exports = userAuthenticate;