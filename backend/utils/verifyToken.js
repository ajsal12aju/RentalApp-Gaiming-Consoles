import jwt from "jsonwebtoken";



export const verifySeller = (req, res, next) =>{
    verifyToken(req,res,next , () => {
        console.log(req.user.isSeller);
        if(req.user.isSeller){
            next();
        } else {
            return next(403, "You are not authorized to perform this action");
        }
    });
};


export const verifyToken = (req,res,next)=>{
    const token = req.cookies.access_token;
    if(!token){
        return next(401, "you are not authanticated")
    }
    jwt.verify(token, process.env.JWT, (err, user)=>{
        if(err) return next(403, "Token is not valied")
        req.user = user;
    next()
    })
}

export const verifyUser = (req, res, next) =>{
    verifyToken(req,res,next, () => {
        if(req.user.id === req.params.id || req.user.isAdmin){
            next()
        }else{
         return next(403, "You are not able to autharized")
        }
    })
}

export const verifyAdmin = (req, res, next) =>{
    verifyToken(req,res,next , () => {
        if(req.user.isAdmin){
            next()
        }else{
         return next(createError(403, "You are noteeee autharized"))
        }
    })
}