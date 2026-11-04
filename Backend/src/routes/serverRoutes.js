import { Router } from "express";
import { authRoutes } from "./authRoutes.js";
import { profileRoutes } from "./profileRoutes.js";

// middleware routes

const serverRoutes = Router();

serverRoutes.use("/api/v2/users", authRoutes);
serverRoutes.use("/api/v2/users/account", profileRoutes);

export {serverRoutes as serverRoutes}