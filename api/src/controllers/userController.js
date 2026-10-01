import {addUser, findUserByEmail} from "../repositories/userRepository.js";
import argon2 from "argon2";
import jwt from "jsonwebtoken";

export async function createUser(req, res) {
    try{
        const alreadyExist = await findUserByEmail(req.body.email);
        if (alreadyExist) {
            return res.status(409).json({
                message: "User already exists",
            })
        }

        const hashedPassword = await argon2.hash(req.body.password);
        const user = {...req.body, password: hashedPassword};

        const newUser = await addUser(user);
        res.status(201).json(newUser);

    } catch (error) {
        if (error.code === "23505") {
            return res.status(409).json({
                message: "User already exists",
            });
        }

        console.error(error);

        res.status(500).json({
            message: "Internal server error",
        })
    }
}

export async function loginUser(req, res) {
    try {
        const user = await findUserByEmail(req.body.email);
        if (!user) {
            return res.status(400).json({
                message: "Invalid email or password",
            })
        }
        const verified = await argon2.verify(user.hashed_password, req.body.password);
        if (!verified) {
            return res.status(400).json({
                message: "Invalid email or password",
            })
        }

        const token = jwt.sign(
            {userId: user.id}, process.env.JWT_SECRET, {expiresIn: "7 days"}
        )
        return res.status(200).json({token})


    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Internal server error",
        })
    }
}
