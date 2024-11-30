import jwt from "jsonwebtoken";

// Middleware to check if user is authenticated

const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token)
      return res
        .status(401)
        .json({ message: "User not authenticated.", success: false });
    const deode = jwt.verify(token, process.env.SECRET_KEY);
    if (!deode)
      return res
        .status(401)
        .json({ message: "User not authenticated.", success: false });
    req.id = deode.userId;

    next();
  } catch (error) {
    console.log(error);
  }
};

export default isAuthenticated;