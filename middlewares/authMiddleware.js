const jwt = require('jsonwebtoken');
const User = require('../models/User');
const bcrypt = require('bcrypt');

const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization
  if (!token) return res.status(401).json({ message: 'Access denied. No token provided.' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded)
    const user = await User.findById(decoded.id);
    if (!user){
      return res.status(404).json({ message: 'User not found.' });
    } else{

    const isMatch = await bcrypt.compare(decoded.password,user.password);


    req.user = user;
    
      if(isMatch){
        next();
      }else{
        return res.status(404).json({ message: 'Password not Match' });
      }
     
     
    }

   
  } catch (err) {
    console.log(err)
    res.status(400).json({ message: 'Invalid token.' });
  }
};

module.exports = authMiddleware;