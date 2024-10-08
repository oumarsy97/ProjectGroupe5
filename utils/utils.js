import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export default class Utils {
    static criptPassword = async password =>{
        const hashedPassword = await bcrypt.hash(password, 10);
        return hashedPassword;  
    }

    static comparePassword = async (password, hashedPassword) => {
        const isMatch = await bcrypt.compare(password, hashedPassword);
        return isMatch;
    };
    static comparePassword = async (password, hashedPassword) => {
        const isMatch = await bcrypt.compare(password, hashedPassword);
        return isMatch;
    };

    static generateToken = (user) => {
        return jwt.sign({ id: user.id }, process.env.SECRET_KEY, { expiresIn: '48h' });
    
    };

    static verifyToken = (token) => {
        return jwt.verify(token, process.env.SECRET_KEY);
    };

    static Code = () => {
        return Math.floor(1000 + Math.random() * 90000000000);
    };

};