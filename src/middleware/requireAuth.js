import jwt from "jsonwebtoken";

const requireAuth = (req, res, next) => {
    const accessToken = req.cookies.accessToken;
    if (!accessToken) {
        res.status(401);
        throw new Error("Not authorized");
    }

    try {
        const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch (err) {
        req.user = null;
        res.status(401);
        throw new Error("Not authorized");
    }
};

export default requireAuth;