import { Router } from "express";
  import UserController from "../controller/UserController";
  import { authenticateToken } from "../classes/Permission";
  import { verifyRoles } from "../classes/Roles";

  const router = Router();

  //reserved for admin
  //Get all users
  router.get("/", [authenticateToken, verifyRoles(["ADMIN"])], UserController.all);

  // Get user
  router.get(
    "/:id([0-9]+)",
    [authenticateToken, verifyRoles(["ADMIN"])],
    UserController.one
  );

  //Create a new user
  router.post("/", [authenticateToken, verifyRoles(["ADMIN"])], UserController.save);

  //Edit one user
  router.patch(
    "/:id([0-9]+)",
    [authenticateToken, verifyRoles(["ADMIN"])],
    UserController.edit
  );

  //Delete one user
  router.delete(
    "/:id([0-9]+)",
    [authenticateToken, verifyRoles(["ADMIN"])],
    UserController.remove
  );

  export default router;