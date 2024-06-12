import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import userRoutes from "./resources/users/users.routes"

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// api routes
app.use("/api", userRoutes);
// app.use("/api", postRouter);


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});