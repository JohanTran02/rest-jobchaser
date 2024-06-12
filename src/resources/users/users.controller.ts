import { prisma } from "../../db/connect";
import { Request, Response } from "express";
import bcrypt from "bcrypt"

type Query = {
    limit?: string,
    sort?: string,
    order?: "asc" | "desc"
}

export async function getUsers(req: Request<{}, {}, {}, Query>, res: Response) {
    try {

        const limit: number = req.query.limit ? parseInt(req.query.limit) : 10;
        const sortField = req.query.sort || 'id';
        const sortOrder = req.query.order || 'asc'

        const sort = { [sortField]: sortOrder }

        const users = await prisma.user.findMany({
            take: limit,
            orderBy: sort
        })

        if (!users.length) return res.status(404).json({ error: "Users not found." })

        res.status(200).json(users)

    } catch (error) {
        console.error("Error details:", error);
        res.status(500).json({ error: "Database query failed!" });
    }
}

export async function getUser(req: Request, res: Response) {
    try {
        const { id } = req.params;

        const user = await prisma.user.findUnique({
            where: {
                id: parseInt(id)
            }
        })

        if (!user) return res.status(404).json({ error: "User not found." })

        res.status(200).json({ user })

    } catch (error) {
        console.error("Error details:", error);
        res.status(500).json({ error: "Database query failed!" });
    }
}

export async function createUser(req: Request, res: Response) {
    try {
        const { name, password, email } = req.body;

        const existingUser = await prisma.user.findUnique({
            where: {
                email: email
            }
        })

        if (existingUser) {
            return res.status(400).json({ error: "User already exists." })
        }

        const saltRounds = 10;
        const hashedPassword = bcrypt.hashSync(password, saltRounds)

        const createdUser = await prisma.user.create({
            data: {
                email: email,
                password: hashedPassword,
                name: name
            }
        })

        res.status(201).json({ id: createdUser.id, message: "User created" })
    }
    catch (error) {
        console.error("Error details:", error);
        res.status(500).json({ error: "Database query failed!" });
    }
}

export async function updateUser(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const { name, password, email } = req.body;

        const saltRounds = 10;
        const hashedPassword = bcrypt.hashSync(password, saltRounds)

        const user = await prisma.user.update({
            where: {
                id: parseInt(id),
            },
            data: {
                email: email,
                password: hashedPassword,
                name: name
            }
        })

        if (!user) {
            return res.status(404).json({ error: "User not found." })
        }

        res.status(201).json({ id: user.id, message: "User updated" })
    }
    catch (error) {
        console.error("Error details:", error);
        res.status(500).json({ error: "Database query failed!" });
    }
}


export async function deleteUser(req: Request, res: Response) {
    try {
        const { id } = req.params;

        const user = await prisma.user.delete({
            where: {
                id: parseInt(id)
            },
        })

        if (!user) {
            return res.status(404).json({ error: "User not found." })
        }

        res.status(20).json({ message: "User deleted" })
    }
    catch (error) {
        console.error("Error details:", error);
        res.status(500).json({ error: "Database query failed!" });
    }
}