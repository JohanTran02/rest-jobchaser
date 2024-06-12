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

        const user = await prisma.user.findUnique({
            where: {
                email: email
            }
        })

        if (user) {
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

router.post("/login", async (req: Request, res: Response) => {
    let now = new Date();
    now.setTime(now.getTime() + 1 * 3600 * 1000);
    try {
        const { email, password } = req.body;

        const user = await prisma.user.findUnique({
            where: {
                email: email
            }
        })

        if (!user) {
            return res.status(400).json({ error: "User not found." })
        }

        const correctPassword = await bcrypt.compare(password, user.password);

        if (!correctPassword) {
            return res.status(400).json({ error: "Wrong email or password." })
        }

        if (!process.env.JWT_SECRET) {
            throw new Error('Missing JWT_SECRET in environment');
        }
        if (!process.env.JWT_EXPIRES_IN) {
            throw new Error('Missing JWT_EXPIRES_IN in environment');
        }

        const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN || '1h',
        });

        return res.json({ token });
    }
    catch (error) {
        console.error("Error details:", error);
        res.status(400).json({ error: "Database query failed!" });
    }
})

export default router;