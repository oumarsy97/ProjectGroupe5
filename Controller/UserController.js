import { User, validateUser, Tailor, validateTailor } from "../Model/User.js";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';
import Utils from "../utils/utils.js";
import { Post } from "../Model/Post.js";

export default class UserController {
  static addUser = async (req, res) => {
    upload.single('photo')(req, res, async (err) => {
      if (err) {
        console.error('Upload error:', err); // Log de l'erreur pour débogage
        return res.status(500).json({ message: "Error processing file", data: null, status: 500 });
      }
      
      const { error } = validateUser(req.body);
      if (error) return res.status(400).json({ message: error.details[0].message, data: null, status: 400 });
      
      const { firstname, lastname, email, password, role, phone, genre } = req.body;
      let photoUrl = null;
  
      // Vérifiez la structure de req.file
      console.log('req.file:', req.file);
  
      if (req.file && req.file.path) {
        photoUrl = req.file.path;  // Utilisez req.file.path pour obtenir l'URL
      }
      
  
      try {
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: "User already exists", data: user, status: 400 });
  
        const newUser = await User.create({ 
          firstname, 
          lastname, 
          email, 
          password: await Utils.criptPassword(password), 
          role, 
          photo: photoUrl,  // Stockez l'URL de l'image
          phone, 
          genre 
        });
  
        res.status(201).json({ message: "User created successfully", data: newUser, status: 201 });
      } catch (error) {
        res.status(500).json({ message: error.message, data: null, status: 500 });
      }
    });
  };
  
  

    static login = async (req, res) => {
        // const { email, password } = req.body;
  try {
     const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({message:'Email ou mot de passe incorrect',data: null,status: false});
    }
    const isMatch = await Utils.comparePassword(password, user.password);
    
    if (!isMatch) {
      return res.status(401).json({message:'Email ou mot de passe incorrect',data: null,status: false});
    } 
    const token = Utils.generateToken(user);
    // console.log(token);
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
          //creer dabord le user puis le tailor
          const {firstname, lastname, email, password, address, description } = req.body;
        //   console.log(firstname, lastname, email, password, address, description );
          let user  = await User.findOne({ email });
          if (user) return res.status(400).json({ message: "User already exists", data: null, status: 400 });
          const newuser =await  User.create({ firstname, lastname, email, password:await Utils.criptPassword(password), role:"tailor" });
        //   console.log(newuser);
          const newtailor = await Tailor.create({ idUser:newuser._id, address, description });
          res.status(201).json({ message: "Tailor created successfully", data: newtailor, status: 201 });
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
    //   const { error } = validateTailor(req.body);
    //   if (error) return res.status(400).json({ message: error.details[0].message ,data:null, status: 400 });
    try {
      const { id } = req.params;
      const { firstname, lastname, email, password, address, description } = req.body;
      const tailor = await Tailor.findById(id);
      if (!tailor) return res.status(404).json({ message: "Tailor not found", data: null, status: 404 });
      const userUpdate = {};
      if (firstname) userUpdate.firstname = firstname;
      if (lastname) userUpdate.lastname = lastname;
      if (email) userUpdate.email = email;
      if (password) userUpdate.password = await Utils.criptPassword(password);
      if (address) userUpdate.address = address;
      if (description) userUpdate.description = description;
      const user = await User.findByIdAndUpdate(id, userUpdate);
      if (!user) return res.status(404).json({ message: "User not found", data: null, status: 404 });
      const updatedTailor = await Tailor.findByIdAndUpdate(id, userUpdate, { new: true });
      res.status(200).json({ message: "Tailor updated successfully", data: updatedTailor, status: 200 });
    } catch (error) {
      res.status(500).json({ message: error.message, data: null, status: 500 });
    }
  };

  static deleteTailor = async (req, res) => {
    try {
      const { id } = req.params;
      const tailor = await Tailor.findByIdAndDelete(id);
      if (!tailor) return res.status(404).json({ message: "Tailor not found", data: null, status: 404 });
      const user = await User.findByIdAndDelete(tailor.idUser);
      if (!user) return res.status(404).json({ message: "User not found", data: null, status: 404 });
      res.status(200).json({ message: "Tailor deleted successfully", data: tailor, status: 200 });
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
  


    }