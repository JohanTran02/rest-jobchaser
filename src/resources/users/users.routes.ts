import express from "express";

import { createUser, getUser } from "./users.controller";
import authRoutes from "./auth.routes"

const router = express.Router();

router.use(authRoutes)

router.post("/users", createUser);
router.get("/users/:id", getUser);

export default router;