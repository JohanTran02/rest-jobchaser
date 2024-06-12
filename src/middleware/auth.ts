import jwt, { JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
dotenv.config();


interface AuthenticatedRequest extends Request {
    user?: JwtPayload;
}

export function auth(req: AuthenticatedRequest, res: Response, next: NextFunction) {

    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.replace("Bearer ", "");

    if (!token) return res.sendStatus(401);

    if (!process.env.JWT_SECRET) throw new Error('Missing JWT_SECRET in environment');

    try {
        const user = jwt.verify(token, process.env.JWT_SECRET)

        req.user = user as JwtPayload;
        next();
    } catch (error) {
        return res.sendStatus(403);
    }
}