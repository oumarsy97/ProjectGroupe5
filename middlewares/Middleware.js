import jwt from 'jsonwebtoken';
const test = (req, res, next) => {
console.log("test middleware");
     next();
}

const auth =async (req, res, next) => {
    const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
    if (!decoded) {
        return res.status(401).json({ message: 'Invalid token', data: null, status: false });
    }

       req.userId = decoded.id;
       
    next();

}

export default {test, auth};