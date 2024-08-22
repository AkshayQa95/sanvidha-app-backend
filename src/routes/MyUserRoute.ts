import MyUserController from "../controllers/MyUserController";
import express from "express";
import { validateMyUserRequest } from "../middleware/validation";
import { jwtCheck, jwtParse } from "../middleware/auth";

const router = express.Router();

// /api/my/user
router.get("/", jwtCheck, jwtParse, MyUserController.getCurrentUser) 
router.post("/", jwtCheck, MyUserController.createCurrentUser)
router.put("/", jwtCheck, jwtParse, validateMyUserRequest, MyUserController.updateCurrentUser);

export default router;