import { usersController } from "@/controllers";
import { Router } from "express";


const usersRouter = Router();

usersRouter
  .get('/', usersController.getUsers)


export { usersRouter };
