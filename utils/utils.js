import bcrypt from 'bcrypt';
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

static generateToken = (user) => {
   const playload = {
       id: user.id}

    const token = jwt.sign(playload, process.env.SECRET_KEY, { expiresIn: '1h' });
    return token
};

};
