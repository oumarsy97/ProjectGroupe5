import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export default class Utils {
    static criptPassword = async password =>{
        const hashedPassword = await bcrypt.hash(password, 10);
        return hashedPassword;  
    }

    static generateToken = (user) => {
        return jwt.sign({ id: user.id }, process.env.SECRET_KEY, { expiresIn: '24h' });
    };

};