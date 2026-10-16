
import Router from "express";
import { healthRouter } from "./healthCheck";

export const apiRouter = Router();

apiRouter.use(healthRouter);