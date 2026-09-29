import {addUser, findUserByEmail} from "../repositories/userRepository.js";
import argon2 from "argon2";

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