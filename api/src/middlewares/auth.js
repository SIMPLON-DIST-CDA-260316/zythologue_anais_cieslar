import {findUserById} from "../repositories/userRepository.js";
import jwt from "jsonwebtoken";

export async function authenticate(req, res, next) {

    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer '))
    {
        return res.status(401).json({ message:'Authentication required'});
    }
    const token = header.split(' ')[1];

    try {
        const payload = jwt.verify(token,process.env.JWT_SECRET);

        const user = await findUserById(payload.userId);

        if (!user) {
            return res.status(401).json({ message:'Authentication required'});
        }

        req.user = user;

        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
}