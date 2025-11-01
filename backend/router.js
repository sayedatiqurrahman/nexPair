import {Router} from "express"
import authController from "./controllers/auth-controller.js";
import authMiddleware from "./middlewares/auth.middleware.js";
import RoomsController from "./controllers/rooms.controller.js";

const router = Router()
// auth-related routes
// #swagger.tags = ['Authentication']
router.get("/api/refresh", authController.refreshToken)
router.post("/api/email-otp", authController.sendOtpByEmail)
router.post("/api/phone-otp", authController.sendOtp)
router.post("/api/verify-otp", authController.verifyOtp)
router.post("/api/activate", authMiddleware, authController.activateAccount)
router.post("/api/logout",authMiddleware ,authController.logout)

// voice-rooms-related routes
// #swagger.tags = ['Rooms']
router.post("/api/rooms", authMiddleware, RoomsController.create)
router.get("/api/rooms", authMiddleware, RoomsController.getAllRooms)

export default router; 