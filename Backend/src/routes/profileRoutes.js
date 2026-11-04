import { Router } from "express";
import { updateUser, getUser2Cookie } from "../controller/controller.js";
const profileRoutes = Router();

// routes for user profiles

profileRoutes.route("/profile").get(getUser2Cookie);
profileRoutes.route("/profile").patch(updateUser);

export { profileRoutes as profileRoutes };
