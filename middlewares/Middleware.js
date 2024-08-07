import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Tailor } from '../Model/User.js';

export default class Middleware {
  
  static auth = async (req, res, next) => {
    try {
      const entete = req.header('Authorization');
      if (!entete) {
        return res.status(401).json({ message: 'No token provided', status: false });
      }

      const token = entete.replace('Bearer ', '');
      const decoded = jwt.verify(token, process.env.SECRET_KEY);

      if (!decoded) {
        return res.status(401).json({ message: 'Invalid token', status: false });
      }

      req.userId = decoded.id;
      next();
    } catch (error) {
      res.status(401).json({ message: 'Invalid token', status: false });
    }
  }

  static isanTailor = async (req, res, next) => {
    try {
      // Appel de l'authentification pour s'assurer que l'utilisateur est authentifié
      await Middleware.auth(req, res, () => {});
      
      const tailor = await Tailor.findOne({ idUser: req.userId });

      if (!tailor) {
        return res.status(401).json({ message: 'You are not a tailor', status: false });
      }

      next();
    } catch (error) {
      res.status(500).json({ message: error.message, status: false });
    }
  }
}