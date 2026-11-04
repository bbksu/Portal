import { Router } from "express";
import { registerUser, loginUser} from "../controller/controller.js";

// routes for user login and registration
const authenticationRoutes = Router();

authenticationRoutes.route("/register").post(registerUser);
authenticationRoutes.route("/login").post(loginUser);

export {authenticationRoutes as authRoutes};
