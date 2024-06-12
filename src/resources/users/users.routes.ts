import express from "express";

import { createUser, getUser, updateUser, deleteUser, getUsers } from "./users.controller";
import authRoutes from "./auth.routes"

const router = express.Router();

router.use(authRoutes)

router.post("/users", createUser);
router.get("/users", getUsers)
router.get("/users/:id", getUser);
router.put("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);

export default router;