import { Router } from "express";
import UserController from "../controller/UserController";
import { authenticateToken } from "../classes/Permission";
import { verifyRoles } from "../classes/Roles";
import { UserRole } from "../entity/User"

const router = Router();

  //reserved for admin
  //Get all users
router.get("/", [authenticateToken, verifyRoles([UserRole.ADMIN])], UserController.all);

  // Get user
router.get(
    "/:id([0-9]+)",
    [authenticateToken, verifyRoles([UserRole.ADMIN])],
    UserController.one
  );

  //Create a new user
router.post("/", [authenticateToken, verifyRoles([UserRole.ADMIN])], UserController.save);

  //Edit one user
router.patch(
    "/:id([0-9]+)",
    [authenticateToken, verifyRoles([UserRole.ADMIN])],
    UserController.edit
);

  //Delete one user
router.delete(
    "/:id([0-9]+)",
    [authenticateToken, verifyRoles([UserRole.ADMIN])],
    UserController.remove
);

export default router;