import jwt from "jsonwebtoken";

// Verifies access and updates req.user appropriately, without throwing an error
const verifyAccess = (req, res, next) => {
    const accessToken = req.cookies.accessToken;
    if (!accessToken) {
        req.user = null;
        return next();
    }

    try {
        const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
        req.user = decoded;
    }
    catch(err) {
        req.user = null;
    }

    next();
}

export default verifyAccess;