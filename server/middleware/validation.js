// Middleware for JWT authentication
const validateSession = async (req, res, next) => {
  try {
    // take the toke provided by the req object
    const token = req.headers.authorization;

    // check the status of the token
    const decodedToken = await jwt.verify(token, process.env.JWT_SECRET);

    // set up response
    const user = await User.findById(decodedToken.id);

    if (!user) throw new Error("User not found");
    req.user = user; // attach the user to the request object
    return next();
  } catch (error) {
    res.json({
      error: "Unauthorized access",
    });
  }
};

module.exports = { validateSession };
