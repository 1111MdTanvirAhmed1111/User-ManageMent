const fs = require('fs');
const path = require('path');
const User = require('../models/User'); // Path to your User model

// Get all users or a specific user
async function GetUsers(req, res) {
  const { id } = req.query;
  const { limit } = req.query;

  try {
    if (id) {
      const user = await User.findById(id);
      user ? res.status(200).json(user) : res.status(404).json({ "title": "User Not Found" });
    } else {
      res.status(200).json(await User.find({}).limit(limit ? limit : 0));
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
 
// Create a new user
const createUser = async (req, res) => {
  try {
    if (!req.body.Udata) {
      return res.status(400).json({ "error": "Please Provide User Details" });
    }

    const { username, fathersname, mothersname, class: userClass, email, password, role, ProfilePic } = JSON.parse(req.body.Udata);

    const user = await User.create({
      username,
      fathersname,
      mothersname,
      class: userClass,
      email,
      password,
      role,
      ProfilePic: req.file ? `./uploads/users/images/${req.file.filename}` : ProfilePic || ""
    });

    res.status(200).json(user);
  } catch (error) {
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ error: 'Failed to create user', message: error.message });
  }
};

// Update a user
async function updateUser(req, res) {
  const { id } = req.params;

  if (!req.body.Udata) {
    return res.status(404).json({ "error": "Please Provide Details" });
  }

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ "error": "User not found" });
    }

    const { username, fathersname, mothersname, class: userClass, email, password, role, ProfilePic } = JSON.parse(req.body.Udata);

    // Handle profile picture update
    let newProfilePic = user.ProfilePic; // Keep old profile picture by default
    if (req.file) {
      // Delete old profile picture if exists
      if (user.ProfilePic && user.ProfilePic !== "") {
        const oldProfilePicPath = path.join(__dirname, '..', user.ProfilePic);
        if (fs.existsSync(oldProfilePicPath)) {
          fs.unlinkSync(oldProfilePicPath);
        }
      }
      newProfilePic = `./uploads/users/images/${req.file.filename}`;
    }

    // Update user details
    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        username,
        fathersname,
        mothersname,
        class: userClass,
        email,
        password,
        role,
        ProfilePic: newProfilePic
      },
      { new: true } // Returns the updated document
    );

    res.status(200).json(updatedUser);
  } catch (error) {
    console.log(error)
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ error: 'Failed to update user' });
  }
}

// Delete a user
async function deleteUser(req, res) {
  const { id } = req.params;

  try {
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ "error": "User not found" });
    }

    // Delete the profile picture if exists
    if (user.ProfilePic && user.ProfilePic !== "") {
      const profilePicPath = path.join(__dirname, '..', user.ProfilePic.replace('.', ''));
      try {
        if (fs.existsSync(profilePicPath)) {
          fs.unlinkSync(profilePicPath);
        }
      } catch (error) {
        console.error('Error deleting profile picture:', error);
      }
    }

    // Delete the user from the database
    await User.findByIdAndDelete(id);

    res.status(200).json({ message: "User deleted successfully", user });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete user' });
  }
}

module.exports = { GetUsers, createUser, updateUser, deleteUser };
