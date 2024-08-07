import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Tailor } from '../Model/User.js';

export default class Middleware {

    static auth = async (req, res, next) => {
        let entete = req.header('Authorization');
        if (!entete) {
            return res.status(401).json({ message: 'No token', data: null, status: false });
        }

        const token = entete.replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        if (!decoded) {
            return res.status(401).json({ message: 'Invalid token', data: null, status: false });
        }
        req.userId = decoded.id;
        next();
    };

    static isanTailor = async (req, res, next) => {
        await this.auth(req, res, async () => {
            const tailor = await Tailor.findOne({ idUser: req.userId });
            if (!tailor) {
                return res.status(401).json({ message: 'You are not a tailor', data: null, status: false });
            }
            next();
        });
    };
}