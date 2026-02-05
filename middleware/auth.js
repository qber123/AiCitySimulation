const User = require('../models/User');
const jwt = require('jsonwebtoken');

const requireAuth = async (req, res, next) => {
  const token = req.cookies.access_token;

  if (!token){
    return res.status(400).json({message: "No token"});
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user)
      return res.status(401).json({ message: "User not found" });

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = requireAuth;