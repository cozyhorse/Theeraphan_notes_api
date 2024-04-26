const jwt = require("jsonwebtoken");

const verifyToken = async (req, res, next) => {
  //Remove "Bearer"
  const token = req.headers.authorization?.split(" ")[1];
  console.log("token", token);
  console.log("secret", process.env.JWT_SECRET);
  if (!token)
    return res
      .status(401)
      .json({ message: "Unauthorized, no token provided!" });

  try {
    const verifiedToken = await jwt.verify(token, process.env.JWT_SECRET);
    req.user = verifiedToken
    console.log("verifiedToken", verifiedToken); 
    next();
} catch (error) {
    return res.status(401).json({ message: "Unauthorized, invalid token!" });
  }
};

module.exports = { verifyToken };
