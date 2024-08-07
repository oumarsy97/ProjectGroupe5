import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Tailor } from '../Model/User.js';

export default class Middleware {

static auth =async (req, res, next) => {
    let entete = req.header('Authorization');
    if(!entete) {
        return res.status(401).json({ message: 'Not token', data: null, status: false });
    }

   const token = entete.replace('Bearer ', '');
//    console.log(process.env.SECRET_KEY);
   const decoded = jwt.verify(token, process.env.SECRET_KEY);
//    console.log(decoded);
    if (!decoded) {
        return res.status(401).json({ message: 'Invalid token', data: null, status: false });
    }
       req.userId = decoded.id; 
    //    console.log(req.userId);
    next();
}

static isanTailor = async (req, res, next) => {
    this.auth(req, res, next);
    const tailor = await Tailor.findOne({ idUser: req.userId });
    console.log(tailor);
    if (!tailor) {
        return res.status(401).json({ message: 'You are not a tailor', data: null, status: false });
    }
    next();
};
}