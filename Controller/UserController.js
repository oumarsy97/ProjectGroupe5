import { User, validateUser, Tailor, validateTailor } from "../Model/User.js";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';
import Utils from "../utils/utils.js";
import { Post } from "../Model/Post.js";
import GenerateCode from "../Model/GenerateCode.js";
import Messenger from "../utils/Messenger.js";
import upload from '../config/multerConfig.js'; // Import de la configuration multer

export default class UserController {
 
static addUser = async (req, res) => {
  upload.single('photo')(req, res, async function (err) {
    if (err) {
      return res.status(400).json({ message: err.message, data: null, status: 400 });
    }
    const { firstname, lastname, email, password, role, phone, genre } = req.body;
    const { error } = validateUser(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message, data: null, status: 400 });
    }
    try {
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ message: "User already exists", data: user, status: 400 });
      }
      const newUser = await User.create({
        firstname,
        lastname,
        email,
        password: await Utils.criptPassword(password),
        role,
        photo: req.file?.path,
        phone,
        genre
      });

      // Envoi d'un e-mail de confirmation
      const emailMessage = `Bienvenue ${firstname} ! Votre compte a été créé avec succès.`;
      await Messenger.sendMail(email, firstname, emailMessage);

      // Envoi d'un SMS de confirmation
      const smsMessage = `Bienvenue ${firstname} ! Votre compte a été créé avec succès.`;
      await Messenger.sendSms(phone, firstname, smsMessage);

      res.status(201).json({ message: "User created successfully", data: newUser, status: 201 });
    } catch (error) {
      res.status(500).json({ message: error.message, data: null, status: 500 });
    }
  });
};
  
  

  static login = async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ message: 'Email ou mot de passe incorrect', data: null, status: false });
      }
      const isMatch = await Utils.comparePassword(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Email ou mot de passe incorrect', data: null, status: false });
      } 
      const token = Utils.generateToken(user);
      res.status(200).json({ message: "User logged in successfully", data: token, status: 200 });
    } catch (error) {
      res.status(500).json({ message: error.message, data: null, status: 500 });
    }
  };

  //Tailor

  static addTailor = async (req, res) => {
    const { error } = validateTailor(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message ,data:null, status: 400 });
    try {
      const { firstname, lastname, email, phone, password, address, description } = req.body;
      let user = await User.findOne({ email });
      if (user) return res.status(400).json({ message: "User already exists", data: null, status: 400 });
      const newUser = await User.create({
        firstname,
        lastname,
        email,
        phone,
        password: await Utils.criptPassword(password),
        role: "tailor"
      });
      const newTailor = await Tailor.create({ idUser: newUser._id, address, description });
  
      // Envoi d'un e-mail de confirmation
      const emailMessage = `Bienvenue ${firstname} ! Votre compte de tailleur a été créé avec succès.`;
      await Messenger.sendMail(email, firstname, emailMessage);
  
      // Envoi d'un SMS de confirmation
      const smsMessage = `Bienvenue ${firstname} ! Votre compte de tailleur a été créé avec succès.`;
      await Messenger.sendSms(phone, firstname, smsMessage);
  
      res.status(201).json({ message: "Tailor created successfully", data: newTailor, status: 201 });
    } catch (error) {
      res.status(500).json({ message: error.message, data: null, status: 500 });
    }
  };

  //lister Users
  static listUser = async (req, res) => {
    try {
      const users = await User.find();
      res.status(200).json({ message: "Users retrieved successfully", data: users, status: 200 });
    } catch (error) {
      res.status(500).json({ message: error.message, data: null, status: 500 });
    }
  };

  //lister Tailors
  static listTailor = async (req, res) => {
    try {
      const tailors = await Tailor.aggregate([
        {
          $lookup: {
            from: "users",
            localField: "idUser",
            foreignField: "_id",
            as: "user",
          },
        },
        { $unwind: "$user" },
        {
          $project: {
            _id: 1, address: 1, description: 1, 'firstname': '$user.firstname',
            'lastname': '$user.lastname',
            'email': '$user.email',
            'role': '$user.role'
          }
        },
      ]);
      res.status(200).json({ message: "Tailors retrieved successfully", data: tailors, status: 200 });
    } catch (error) {
      res.status(500).json({ message: error.message, data: null, status: 500 });
    }
  };

  static updateUser = async (req, res) => {
    const { error } = validateUser(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message, data: null, status: 400 });
    try {
      const { id } = req.params;
      const user = await User.findByIdAndUpdate(id, req.body, { new: true });
      if (!user) return res.status(404).json({ message: "User not found", data: null, status: 404 });
      res.status(200).json({ message: "User updated successfully", data: user, status: 200 });
    } catch (error) {
      res.status(500).json({ message: error.message, data: null, status: 500 });
    }
  };

  static deleteUser = async (req, res) => {
    try {
      const { id } = req.params;
      const user = await User.findByIdAndDelete(id);
      if (!user) return res.status(404).json({ message: "User not found", data: null, status: 404 });
      res.status(200).json({ message: "User deleted successfully", data: user, status: 200 });
    } catch (error) {
      res.status(500).json({ message: error.message, data: null, status: 500 });
    }
  };

  //update tailor
  static updateTailor = async (req, res) => {
    const { id } = req.params;
    const { firstname, lastname, phone, email, address, description } = req.body;
    const { error } = validateTailor(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message, data: null, status: 400 });

    try {
      const tailor = await Tailor.findById(id);
      if (!tailor) return res.status(404).json({ message: "Tailor not found", data: null, status: 404 });

      const user = await User.findByIdAndUpdate(tailor.idUser, { firstname, lastname, phone, email }, { new: true });
      if (!user) return res.status(404).json({ message: "User not found", data: null, status: 404 });

      tailor.address = address;
      tailor.description = description;
      await tailor.save();

      res.status(200).json({ message: "Tailor updated successfully", data: tailor, status: 200 });
    } catch (error) {
      res.status(500).json({ message: error.message, data: null, status: 500 });
    }
  };

  static deleteTailor = async (req, res) => {
    try {
      const { id } = req.params;
      const tailor = await Tailor.findById(id);
      if (!tailor) return res.status(404).json({ message: "Tailor not found", data: null, status: 404 });

      await User.findByIdAndDelete(tailor.idUser);
      await Tailor.findByIdAndDelete(id);
      res.status(200).json({ message: "Tailor deleted successfully", data: null, status: 200 });
    } catch (error) {
      res.status(500).json({ message: error.message, data: null, status: 500 });
    }
  };

  //add favoris
  static addFavoris = async (req, res) => {
    try {
      const { idPost } = req.params;
      const idUser = req.userId;
      const user = await User.findById(idUser);
      if (!user) return res.status(404).json({ message: "User not found", data: null, status: 404 });
      if (user.favoris.includes(idPost)) return res.status(400).json({ message: "Post already favoris", data: null, status: 400 });
      user.favoris.push(idPost);
      await user.save();
      res.status(200).json({ message: "Post added to favoris successfully", data: user, status: 200 });
    } catch (error) {
      res.status(500).json({ message: error.message, data: null, status: 500 });
    }
  }

  static deleteFavoris = async (req, res) => {
    try {
      const { idPost } = req.params;
      const idUser = req.userId;
      const user = await User.findById(idUser);
      if (!user) return res.status(404).json({ message: "User not found", data: null, status: 404 });
      if (!user.favoris.includes(idPost)) return res.status(400).json({ message: "Post not favoris", data: null, status: 400 });
      const index = user.favoris.indexOf(idPost);
      user.favoris.splice(index, 1);
      await user.save();
      res.status(200).json({ message: "Post deleted from favoris successfully", data: user, status: 200 });
    } catch (error) {
      res.status(500).json({ message: error.message, data: null, status: 500 });
    }
  }

  static addCredit = async (req, res) => {
    try {
      const idUser = req.userId;
      const { code } = req.body;
      const user = await User.findById(idUser);
      if (!user) return res.status(404).json({ message: "User not found", data: null, status: 404 });
      const mycode = await GenerateCode.findOne({ code: code });
      if (!mycode) return res.status(404).json({ message: "Code not valide", data: null, status: 404 });
      if(mycode.status === 'used') return res.status(400).json({ message: "Code already used", data: null, status: 400 });
      const tailor = await Tailor.findOne({ idUser });
      if (!tailor) return res.status(404).json({ message: "Tailor not found", data: null, status: 404 });
      const credits = tailor.credits + mycode.credits;
      tailor.credits = credits;
      mycode.status = 'used';
      await mycode.save();
      await tailor.save();
      res.status(200).json({ message: "Credits added successfully", data: tailor, status: 200 });
    } catch (error) {
      res.status(500).json({ message: error.message, data: null, status: 500 });
    }
  }

  static achatCode = async (req, res) => {
    try {
      const idUser = req.userId;
      const user = await User.findById(idUser);
      if (!user) return res.status(404).json({ message: "User not found", data: null, status: 404 });
      const {montant, modePaiement} = req.body;
      if(montant<100) return res.status(400).json({ message: "Montant invalide", data: null, status: 400 });
      const newGerenerateCode = {
        montant, 
        modePaiement,
        code : Utils.Code(),
        credits : montant / 100
      }
      const newcode = await GenerateCode.create(newGerenerateCode);
      res.status(200).json({ message: "Code created successfully", data: newcode, status: 200 });
      const recu = `Recu<br>Montant : ${newcode.montant}<br>Mode de paiement : ${newcode.modePaiement}<br>Code : ${newcode.code}<br>Credits : ${newcode.credits}<br> Date : ${newcode.createdAt}<br>expire dans 7 jours`;
      Messenger.sendSms(user.phone, 'Tailor Digital', `Votre code de paiement est : ${recu}`);
      Messenger.sendMail(user.email, 'Tailor Digital', `Votre code de paiement est : ${recu}`);
    } catch (error) {
      res.status(500).json({ message: error.message, data: null, status: 500 });
    }
  } 


// passer de user a tailor
static becomeTailor = async (req, res) => {
  try {
    const { id } = req.params;
    const { address, description } = req.body;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found", data: null, status: 404 });
    }

    let tailor = await Tailor.findOne({ idUser: id });
    if (tailor) {
      return res.status(400).json({ message: "User is already a tailor", data: null, status: 400 });
    }

    // Créez un nouveau tailleur
    tailor = await Tailor.create({
      idUser: id,
      address,
      description
    });

    // Mettez à jour le rôle de l'utilisateur
    user.role = "tailor";
    await user.save();

    // Vérifiez que la mise à jour a bien été effectuée
    const updatedUser = await User.findById(id);
    if (updatedUser.role !== "tailor") {
      throw new Error("Failed to update user role");
    }

    // Envoi d'un e-mail
    const emailMessage = "Vous êtes désormais un tailleur";
    await Messenger.sendMail(user.email, user.firstname, emailMessage);

    // Envoi d'un SMS
    const smsMessage = "Vous êtes désormais un tailleur";
    await Messenger.sendSms(user.phone, user.firstname, smsMessage);

    res.status(200).json({ 
      message: "User successfully became a tailor", 
      data: { tailor, userRole: updatedUser.role }, 
      status: 200 
    });
  } catch (error) {
    console.error("Error in becomeTailor:", error);
    res.status(500).json({ message: error.message, data: null, status: 500 });
  }
};


}