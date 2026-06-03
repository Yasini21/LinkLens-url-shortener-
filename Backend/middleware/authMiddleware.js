import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        msg: "No token provided",
      });
    }

    const token = authHeader.split(" ")[1];
//     console.log("MIDDLEWARE SECRET:", process.env.JWT_SECRET);
// console.log("RECEIVED TOKEN:", token);
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    req.user = decoded;

    next();

  } catch (error) {
    console.log("JWT Error: ",error);
    return res.status(401).json({
      msg: "Invalid token",
    });
  }
};

export default authMiddleware;