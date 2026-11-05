
import Router from "express";
import { healthRouter } from "./healthCheck";
import { authRouter } from "./auth.router";

export const apiRouter = Router();

apiRouter.use(healthRouter);
apiRouter.use(authRouter);