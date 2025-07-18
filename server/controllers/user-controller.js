// User controller
const User = require("../schemas/user.model");

// signup new user
exports.signup = async (req, res) => {
  try {
    // destructure the body to get details for the body
    const { firstName, lastName, email, password } = req.body;

    // create a new user instance
    const user = new User({
      firstName,
      lastName,
      email,
      password: await bcrypt.hash(password, 10), //hash the password 10 times
    });

    // save the new user to the database
    const newUser = await user.save();

    // issue the toke to the user
    const token = jwt.sign(
      {
        id: newUser.id,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      user: newUser,
      token: token,
      message: "User has been registered successfully!",
    });
  } catch (error) {
    console.error("Error registering user", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// existing user login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // find the user by their email
    const foundUser = await User.findOne({ email });

    // check if the user exists
    if (!foundUser) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    // compare the password with the hashed password
    const verifyPwd = await bcrypt.compare(password, foundUser.password);

    // check the validity of the password
    if (!verifyPwd) {
      return res.status(401).json({
        error: "Invalid password",
      });
    }

    // issue the token to the user
    const token = jwt.sign(
      {
        id: foundUser.id,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // respond with user details and token
    res.status(200).json({
      user: foundUser,
      token: token,
      message: "Login successful!",
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
