import jwt from "jsonwebtoken";

import createError from "http-errors";


export const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) {
    return next(createError(401, "You are not authenticated"));
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return next(createError(403, "Token is not valid"));
    req.user = user;
    next();
  });
};

export const verifySeller = (req, res, next) => {
  verifyToken(req, res, (err) => {
    if (err) return next(err);
    console.log(req.user, "========USER=========");
    if (req.user && req.user.userType === "Seller") {
      next();
    } else {
      return next(
       next(createError(403, "You are not authorized to perform this action")))
    }
  });
};

