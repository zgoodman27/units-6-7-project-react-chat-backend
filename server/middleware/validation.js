const jwt = require("jsonwebtoken");
const User = require("../schemas/user.model"); // Import the User model
// Middleware for JWT authentication
const validateSession = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: "Unauthorized access: No token provided or malformed header" });
    }
    // take the toke provided by the req object
    const token = authHeader.split(" ")[1];

    // check the status of the token
    const decodedToken = await jwt.verify(token, process.env.JWT_SECRET);

    // set up response
    const user = await User.findById(decodedToken.id);

    if (!user) throw new Error("User not found");
    req.user = user; // attach the user to the request object
    return next();
  } catch (error) {
    res.status(401).json({
      error: "Unauthorized access",
    });
  }
};

module.exports = { validateSession };
