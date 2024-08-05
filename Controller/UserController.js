import { User, validateUser } from "../Model/User.js";
import  bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import Utils from "../utils/utils.js";

export default class UserController {
static addUser = async (req, res) => {
    const { error } = validateUser(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message ,data:null, status: 400 });
    try { 
      
    const { firstname, lastname, email, password, role, photo,phone,genre } = req.body;
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "User already exists", data: user, status: 400 });
    const newuser =await  User.create({ firstname, lastname, email, password:await Utils.criptPassword(password), role, photo,phone,genre });
     
    res.status(201).json({ message: "User created successfully", data: newuser, status: 201 });
    } catch (error) {
    res.status(500).json({ message: error.message, data: null, status: 500 });
    } 
    };

    static login = async (req, res) => {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "User not found", data: null, status: 400 });
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) return res.status(400).json({ message: "Invalid password", data: null, status: 400 });
        const token = Utils.generateToken(user);
        res.status(200).json({ message: "Login successful", data: token, status: 200 });
    };
};