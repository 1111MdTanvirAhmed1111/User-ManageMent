const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const User = require('../models/User');
const { validateInput } = require('../utils/validateInput');

exports.register = async (req, res) => {


  

  try {
    const { username, fathersname, mothersname, class: userClass, email, password, role } = JSON.parse(req.body.Udata);

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists.' });
    }
const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      fathersname,
      mothersname,
      class: userClass,
      email,
      password: hashedPassword,
      role,
      ProfilePic: req.file ? `./uploads/users/images/${req.file.filename}` : ProfilePic || ""
    });

    res.status(201).json({ message: 'User registered successfully.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.login = async (req, res) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  });

  const { error } = validateInput(req.body, schema);
  if (error) return res.status(400).json({ message: error.details[0].message });

  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid email or password.' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch == true) {
      
      

      const token = jwt.sign({ id: user._id, password }, process.env.JWT_SECRET, { expiresIn: '1h' });
    
      res.status(200).json({ token });
      
     
    }else{
  
      return res.status(400).json({ message: 'Invalid email or password.' })
}
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};







exports.getUserData = async (req, res) => {
  try {
    // Get the token from the Authorization header
    const token = req.headers.authorization;
    
    if (!token ) {
      return res.status(401).json({ message: 'No token provided or invalid format' });
    }

    // Extract the token (remove 'Bearer ' prefix)


    try {
      // Verify the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if(!decoded){
        return res.status(401).json({ message: 'Invalid token' });
      }
      // Find user by id (exclude password from response)
      const user = await User.findById(decoded.id)
 console.log(user._id)
      if (!user) {
        console.log(user)
        return res.status(404).json({ message: 'User not found' });
      }

      // Return user data
      res.status(200).json({
       
          _id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
          // Add any other user fields you want to return
      
      });
    } catch (err) {
      if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({ message: 'Invalid token' });
      }
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Token expired' });
      }
      throw err;
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
  };