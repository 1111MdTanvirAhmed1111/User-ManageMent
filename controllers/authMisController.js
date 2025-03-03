const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// Create a transporter to send emails using MailSlurp SMTP
const transporter = nodemailer.createTransport({
  host: 'mailslurp.mx',   // MailSlurp SMTP host
  port: 2525,                   // MailSlurp SMTP port
  auth: {
    user: process.env.EMAIL_USER,  // Your MailSlurp inbox ID (from the dashboard)
    pass: process.env.EMAIL_PASS,  // Your MailSlurp SMTP password (from the dashboard)
  },
  debug: true, // Enable debug mode to help identify any issues
});

// Controller to handle "Forgot Password" and send verification code
const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).send('User with this email does not exist');
    }

    // Generate a random string and hash it using bcryptjs to create a reset token
    const randomString = Math.random().toString(36).substr(2); // Random string
    const resetToken = await bcrypt.hash(randomString, 10); // Hash the string (salt rounds = 10)
    const resetTokenExpiry = Date.now() + 3600000;  // Token valid for 1 hour

    // Update user with reset token and expiry
    user.resetToken = resetToken;
    user.resetTokenExpiry = resetTokenExpiry;
    await user.save();

    // Send the email with the verification code
    const mailOptions = {
      from: process.env.EMAIL_USER,  // Sender's email (MailSlurp inbox)
      to: user.email,                // Recipient's email
      subject: 'Password Reset Request',  // Email subject
      html: `
        <p>We received a request to reset your password. Please use the following code to reset it:</p>
        <p><strong>${resetToken}</strong></p>
        <p>The code will expire in 1 hour.</p>
      `,  // HTML content of the email
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).send('Verification code sent to your email');
  } catch (error) {
    console.error(error);
    return res.status(500).send('Something went wrong');
  }
};

// Controller to handle password reset and verification
const resetPassword = async (req, res) => {
  const { email, resetToken, newPassword } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).send('User not found');
    }

    // Check if the reset token is valid and not expired
    if (user.resetTokenExpiry < Date.now()) {
      return res.status(400).send('Verification code has expired');
    }

    // Compare the provided reset token with the hashed token stored in the database
    const isMatch = await bcrypt.compare(resetToken, user.resetToken);
    if (!isMatch) {
      return res.status(400).send('Invalid verification code');
    }

    // Hash the new password
    user.password = await bcrypt.hash(newPassword, 10);

    // Clear reset token fields
    user.resetToken = null;
    user.resetTokenExpiry = null;
    await user.save();

    return res.status(200).send('Password successfully changed');
  } catch (error) {
    console.error(error);
    return res.status(500).send('Something went wrong');
  }
};

module.exports = { forgotPassword, resetPassword };
