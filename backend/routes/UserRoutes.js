import express from "express";
import User from "../models/UserModel.js";
import bcrypt from "bcryptjs";
import { generateToken, isAuth, isAdmin } from "../utils.js";
import expressAsyncHandler from "express-async-handler";
import jwt from "jsonwebtoken"; // jsonwebtoken is used for creating authenticated requests

const UserRouter = express.Router();

UserRouter.get(
    '/',
    isAuth,
    isAdmin,
    expressAsyncHandler(async (req, res) => {
        const users = await User.find({});
        res.send(users);
    })
);

UserRouter.post('/signin', expressAsyncHandler(async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
        if (bcrypt.compareSync(req.body.password, user.password)) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
            res.send({
                _id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
                token: generateToken(user),
            })
            return;
        } else {
            res.status(401).send({ message: 'Invalid email or password' });
        }
    }
}
)
); // expressAsyncHandler package is a function that catches error in async function inside it. "npm install express-async-handler"
UserRouter.post('/signup', expressAsyncHandler(async (req, res) => {
    const NewUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password),
    });
    const user = await NewUser.save();
    res.send({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user),
    });
}));

UserRouter.put(
    '/profile',
    isAuth,
    expressAsyncHandler(async (req, res) => {
        const user = await User.findById(req.user._id);
        if (user) {
            user.name = req.body.name || user.name;
            user.email = req.body.email || user.email;
            if (req.body.password) {
                user.password = bcrypt.hashSync(req.body.password);
            }
            const updatedUser = await user.save();
            res.send({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                isAdmin: updatedUser.isAdmin,
                token: generateToken(updatedUser),
            });
        }
        else {
            res.status(404).send({ message: 'User not found' });
        }
    })
)
export default UserRouter;