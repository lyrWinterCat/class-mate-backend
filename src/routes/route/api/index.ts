import { Router, Request, Response } from 'express';
import apitestRouter from './apitest/index';

const router = Router();

router.post("/", async (req: Request, res: Response) => {
  try {
    res.status(200).send({ message: "api router is running!" });
  } catch (error) {
    res.status(404).send({ message: (error as Error).message });
  }
});

router.use("/", apitestRouter);

export default router;