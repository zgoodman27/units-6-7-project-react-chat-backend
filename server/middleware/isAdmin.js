const User = require("..//schemas/user.model");

const adminOnly = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user || !user.isAdmin) {
      return res.status(403).json({ message: "Admin access is required." });
    }
    next();
  } catch (error) {
    res
      .status(500)
      .json({ message: "A server error occured. Please try again." });
  }
};

module.exports = adminOnly;
