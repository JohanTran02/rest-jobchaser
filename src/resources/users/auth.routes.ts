import express, { Response, Request } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../../db/connect';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();

router.post("/register", async (req: Request, res: Response) => {
    try {
        const { name, password, email } = req.body;

        const existingUser = await prisma.user.findUnique({
            where: {
                email: email
            }
        })

        if (existingUser) {
            return res.status(400).json({ error: "User with email already exists." })
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds)

        const createdUser = await prisma.user.create({
            data: {
                email: email,
                name: name,
                password: hashedPassword,
            }
        })

        res.status(201).json({ id: createdUser.id, message: "User created" })
    }
    catch (error) {
        console.error("Error details:", error);
        res.status(400).json({ error: "Database query failed!" });
    }
})

export default router;